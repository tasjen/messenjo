package models

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type IDataModel interface {
	GetUserByUsername(ctx context.Context, username string) (User, error)
	GetUserById(ctx context.Context, userId uuid.UUID) (User, error)
	GetContacts(ctx context.Context, userId uuid.UUID) ([]Contact, error)
	GetMessagesFromGroupId(ctx context.Context, userId, groupId uuid.UUID) ([]Message, error)
	GetGroupIdsFromUserId(ctx context.Context, userId uuid.UUID) ([]uuid.UUID, error)
	AddUser(ctx context.Context, username, pfp string) (uuid.UUID, error)
	UpdateUser(ctx context.Context, userId uuid.UUID, username, pfp string) error
	CreateGroup(ctx context.Context, name, pfp string, userIds ...uuid.UUID) (uuid.UUID, error)
	UpdateGroup(ctx context.Context, groupId uuid.UUID, name, pfp string) error
	AddFriend(ctx context.Context, fromUserId, toUserId uuid.UUID) (uuid.UUID, error)
	AddMembers(ctx context.Context, groupId uuid.UUID, userIds ...uuid.UUID) error
	AddMessage(ctx context.Context, userId, groupId uuid.UUID, content string, sentAt time.Time) (int32, string, string, error)
	ResetUnreadCount(ctx context.Context, groupId, userId uuid.UUID) error
}

type DataModel struct {
	DB *pgxpool.Pool
}

type Contact struct {
	Type          string
	GroupId       uuid.UUID
	UserId        uuid.UUID
	Name          string
	Pfp           string
	MemberCount   int
	UnreadCount   int
	LastMessageId int
	LastContent   string
	LastSentAt    time.Time
}

var (
	users    UserModel
	groups   GroupModel
	members  MemberModel
	messages MessageModel
)

func NewDataModel(db *pgxpool.Pool) *DataModel {
	users = *NewUserModel(db)
	groups = *NewGroupModel(db)
	members = *NewMemberModel(db)
	messages = *NewMessageModel(db)
	return &DataModel{DB: db}
}

func (d *DataModel) GetUserByUsername(ctx context.Context, username string) (User, error) {
	user, err := users.GetByUsername(ctx, username)
	switch {
	case err == pgx.ErrNoRows:
		return User{}, nil
	case err != nil:
		return User{}, err
	}
	return user, nil
}

func (d *DataModel) GetUserById(ctx context.Context, userId uuid.UUID) (User, error) {
	return users.GetById(ctx, userId)
}

func (d *DataModel) GetContacts(ctx context.Context, userId uuid.UUID) ([]Contact, error) {
	stmt := `
	WITH latest_messages AS (
		SELECT DISTINCT ON (group_id) *
		FROM messages
		ORDER BY group_id, sent_at DESC
	),
	my_contacts AS (
		SELECT *
		FROM members
		WHERE user_id = $1
	)
	SELECT
		DISTINCT
		CASE
			WHEN groups.name = '' THEN  'friend'
			ELSE 'group'
		END AS "type",
		groups.id AS group_id,
		CASE
			WHEN groups.name = '' THEN users.id
			ELSE NULL
		END AS user_id,
		COALESCE(
			NULLIF(groups.name, ''),
			users.username
		) AS name,
		CASE
			WHEN groups.name = '' THEN users.pfp
			ELSE groups.pfp
		END AS pfp,
		CASE
			WHEN groups.name = '' THEN NULL
			ELSE (SELECT COUNT(*) FROM members WHERE members.group_id = groups.id)
		END AS member_count,
		my_contacts.unread_count AS unread_count,
		latest_messages.id AS last_message_id,
		latest_messages.content AS last_content,
		latest_messages.sent_at AS last_sent_at
	FROM
		members
		JOIN "groups"
		ON members.group_id = groups.id
		JOIN my_contacts
		ON members.group_id = my_contacts.group_id
		JOIN users
		ON members.user_id = users.id
		LEFT JOIN latest_messages
		ON groups.id = latest_messages.group_id
	WHERE
		users.id != $1;`
	rows, err := d.DB.Query(ctx, stmt, userId)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return []Contact{}, nil
		}
		return []Contact{}, err
	}

	contacts, err := pgx.CollectRows(rows, func(row pgx.CollectableRow) (Contact, error) {
		var c Contact
		var memberCount sql.NullInt32
		var lastMessageId sql.NullInt32
		var lastContent sql.NullString
		var lastSentAt sql.NullTime
		err := row.Scan(
			&c.Type,
			&c.GroupId,
			&c.UserId,
			&c.Name,
			&c.Pfp,
			&memberCount,
			&c.UnreadCount,
			&lastMessageId,
			&lastContent,
			&lastSentAt,
		)
		c.MemberCount = int(memberCount.Int32)
		c.LastMessageId = int(lastMessageId.Int32)
		c.LastContent = lastContent.String
		c.LastSentAt = lastSentAt.Time
		return c, err
	})

	return contacts, err
}

func (d *DataModel) GetMessagesFromGroupId(ctx context.Context, userId, groupId uuid.UUID) ([]Message, error) {
	return messages.GetFromGroupId(ctx, userId, groupId)
}

func (d *DataModel) GetGroupIdsFromUserId(ctx context.Context, userId uuid.UUID) ([]uuid.UUID, error) {
	return members.GetGroupIdsFromUserId(ctx, userId)
}

func (d *DataModel) AddUser(ctx context.Context, username, pfp string) (uuid.UUID, error) {
	return users.Add(ctx, username, pfp)
}

func (d *DataModel) UpdateUser(ctx context.Context, userId uuid.UUID, username, pfp string) error {
	return users.Update(ctx, userId, username, pfp)
}

func (d *DataModel) CreateGroup(ctx context.Context, name, pfp string, userIds ...uuid.UUID) (uuid.UUID, error) {
	tx, err := d.DB.Begin(ctx)
	if err != nil {
		return uuid.UUID{}, err
	}
	defer tx.Rollback(ctx)

	groupId, err := groups.Add(ctx, tx, name, pfp)
	if err != nil {
		return uuid.UUID{}, err
	}

	err = members.Add(ctx, tx, groupId, userIds...)
	if err != nil {
		return uuid.UUID{}, err
	}

	err = tx.Commit(ctx)
	if err != nil {
		return uuid.UUID{}, err
	}

	return groupId, nil
}

func (d *DataModel) UpdateGroup(ctx context.Context, groupId uuid.UUID, name, pfp string) error {
	return groups.Update(ctx, groupId, name, pfp)
}

func (d *DataModel) AddFriend(ctx context.Context, fromUserId, toUserId uuid.UUID) (uuid.UUID, error) {
	isFriend, err := users.IsFriend(ctx, fromUserId, toUserId)
	if err != nil {
		return uuid.UUID{}, err
	}
	if isFriend {
		return uuid.UUID{}, errors.New("already friends")
	}

	tx, err := d.DB.Begin(ctx)
	if err != nil {
		return uuid.UUID{}, err
	}
	defer tx.Rollback(ctx)

	groupId, err := groups.Add(ctx, tx, "", "")
	if err != nil {
		return uuid.UUID{}, err
	}

	err = members.Add(ctx, tx, groupId, fromUserId, toUserId)
	if err != nil {
		return uuid.UUID{}, err
	}

	err = tx.Commit(ctx)
	if err != nil {
		return uuid.UUID{}, err
	}

	return groupId, nil
}

func (d *DataModel) AddMembers(ctx context.Context, groupId uuid.UUID, userIds ...uuid.UUID) error {
	tx, err := d.DB.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	err = members.Add(ctx, tx, groupId, userIds...)
	if err != nil {
		return err
	}

	err = tx.Commit(ctx)
	if err != nil {
		return err
	}
	return nil
}

func (d *DataModel) AddMessage(ctx context.Context, userId, groupId uuid.UUID, content string, sentAt time.Time) (int32, string, string, error) {
	return messages.Add(ctx, userId, groupId, content, sentAt)
}

func (d *DataModel) ResetUnreadCount(ctx context.Context, groupId, userId uuid.UUID) error {
	return members.ResetUnreadCount(ctx, groupId, userId)
}

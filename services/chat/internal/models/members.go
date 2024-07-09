package models

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type IMemberModel interface {
	Add(ctx context.Context, tx pgx.Tx, groupId uuid.UUID, userIds ...uuid.UUID) error
	Remove(ctx context.Context, userId, groupId uuid.UUID) error
	GetGroupIdsFromUserId(ctx context.Context, userId uuid.UUID) ([]uuid.UUID, error)
	ResetUnreadCount(ctx context.Context, groupId, userId uuid.UUID) error
}

type MemberModel struct {
	DB *pgxpool.Pool
}

func NewMemberModel(db *pgxpool.Pool) *MemberModel {
	return &MemberModel{DB: db}
}

type Member struct {
	GroupId     uuid.UUID `db:"group_id"`
	UserId      uuid.UUID `db:"user_id"`
	UnreadCount int16     `db:"unread_count"`
}

func (m *MemberModel) Add(ctx context.Context, tx pgx.Tx, groupId uuid.UUID, userIds ...uuid.UUID) error {
	_, err := tx.CopyFrom(
		ctx,
		pgx.Identifier{"members"},
		[]string{"user_id", "group_id"},
		pgx.CopyFromSlice(len(userIds), func(i int) ([]any, error) {
			return []any{userIds[i], groupId}, nil
		}),
	)
	return err
}

func (m *MemberModel) Remove(ctx context.Context, userId, groupId uuid.UUID) error {
	stmt := `
	DELETE FROM members
	WHERE user_id = $1
		AND group_id = $2;`
	_, err := m.DB.Exec(ctx, stmt, userId, groupId)
	return err
}

func (m *MemberModel) GetGroupIdsFromUserId(ctx context.Context, userId uuid.UUID) ([]uuid.UUID, error) {
	stmt := `
		SELECT group_id
 		FROM members
 		WHERE user_id = $1;`

	rows, err := m.DB.Query(ctx, stmt, userId)
	if err != nil {
		return []uuid.UUID{}, err
	}

	groupIds, err := pgx.CollectRows(rows, func(row pgx.CollectableRow) (uuid.UUID, error) {
		var groupId uuid.UUID
		err := row.Scan(&groupId)
		return groupId, err
	})

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return []uuid.UUID{}, nil
		}
		return []uuid.UUID{}, err
	}

	return groupIds, nil
}

func (m *MemberModel) ResetUnreadCount(ctx context.Context, groupId, userId uuid.UUID) error {
	stmt := `
		UPDATE members
		SET unread_count = 0
		WHERE group_id = $1 AND user_id = $2;`
	_, err := m.DB.Exec(ctx, stmt, groupId, userId)
	return err
}

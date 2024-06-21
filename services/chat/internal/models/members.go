package models

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

type IMemberModel interface {
	Add(ctx context.Context, tx pgx.Tx, groupId uuid.UUID, userIds []uuid.UUID) error
	GetGroupIds(ctx context.Context, userId uuid.UUID) ([]uuid.UUID, error)
	ResetUnreadCount(ctx context.Context, groupId, userId uuid.UUID) error
}

type MemberModel struct{}

func NewMemberModel() *MemberModel {
	return &MemberModel{}
}

type Member struct {
	GroupId     uuid.UUID `db:"group_id"`
	UserId      uuid.UUID `db:"user_id"`
	UnreadCount int16     `db:"unread_count"`
}

func (m *MemberModel) Add(ctx context.Context, tx pgx.Tx, groupId uuid.UUID, userIds []uuid.UUID) error {
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

func (m *MemberModel) GetGroupIds(ctx context.Context, userId uuid.UUID) ([]uuid.UUID, error) {
	stmt := `
		SELECT group_id
 		FROM members
 		WHERE user_id = $1;`

	rows, err := DB.Query(ctx, stmt, userId)
	if err != nil {
		return []uuid.UUID{}, err
	}

	groupIds, err := pgx.CollectRows(rows, func(row pgx.CollectableRow) (uuid.UUID, error) {
		var groupId uuid.UUID
		err := row.Scan(&groupId)
		return groupId, err
	})

	return groupIds, err
}

func (m *MemberModel) ResetUnreadCount(ctx context.Context, groupId, userId uuid.UUID) error {
	stmt := `
		UPDATE members
		SET unread_count = 0
		WHERE group_id = $1 AND user_id = $2;`
	_, err := DB.Exec(ctx, stmt, groupId, userId)
	return err
}

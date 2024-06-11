package models

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

type IMemberModel interface {
	Add(ctx context.Context, tx pgx.Tx, groupId uuid.UUID, userIds []uuid.UUID) error
	IncUnreadCount(ctx context.Context, tx pgx.Tx, groupId, userId uuid.UUID) error
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

func (m *MemberModel) IncUnreadCount(ctx context.Context, tx pgx.Tx, groupId, userId uuid.UUID) error {
	stmt := `
	UPDATE members
	SET unread_count = LEAST(unread_count + 1, 99)
	WHERE group_id = $1 and user_id != $2;`
	_, err := tx.Exec(ctx, stmt, groupId, userId)
	return err
}

func (m *MemberModel) ResetUnreadCount(ctx context.Context, groupId, userId uuid.UUID) error {
	println(111)
	stmt := `
		UPDATE members
		SET unread_count = 0
		WHERE group_id = $1 AND user_id = $2;`
	_, err := DB.Exec(ctx, stmt, groupId, userId)
	println(groupId.String())
	println(userId.String())
	return err
}

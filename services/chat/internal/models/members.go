package models

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

type IMemberModel interface {
	Add(ctx context.Context, tx pgx.Tx, groupId uuid.UUID, userIds []uuid.UUID) error
}

type MemberModel struct{}

func NewMemberModel() *MemberModel {
	return &MemberModel{}
}

type Member struct {
	UserId  uuid.UUID `db:"user_id"`
	GroupId uuid.UUID `db:"group_id"`
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

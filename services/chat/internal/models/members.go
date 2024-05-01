package models

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

type IMemberModel interface {
	Add(ctx context.Context, tx pgx.Tx, userId, groupId uuid.UUID) error
}

type MemberModel struct{}

func NewMemberModel() *MemberModel {
	return &MemberModel{}
}

type Member struct {
	UserId  uuid.UUID `db:"user_id"`
	GroupId uuid.UUID `db:"group_id"`
}

func (m *MemberModel) Add(ctx context.Context, tx pgx.Tx, userId, groupId uuid.UUID) (err error) {
	stmt := `INSERT INTO members (user_id, group_id) VALUES ($1, $2);`
	if tx != nil {
		_, err = tx.Exec(ctx, stmt, userId, groupId)
	} else {
		_, err = DB.Exec(ctx, stmt, userId, groupId)
	}
	return err
}

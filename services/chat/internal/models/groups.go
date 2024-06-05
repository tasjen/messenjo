package models

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

type IGroupModel interface {
	Add(ctx context.Context, tx pgx.Tx, groupId uuid.UUID, groupName, pfp string) error
}

type GroupModel struct{}

func NewGroupModel() *GroupModel {
	return &GroupModel{}
}

type Group struct {
	GroupId   uuid.UUID `db:"id"`
	GroupName string    `db:"name"`
	Pfp       string    `db:"pfp"`
}

func (m *GroupModel) Add(ctx context.Context, tx pgx.Tx, groupId uuid.UUID, groupName, pfp string) error {
	stmt := `INSERT INTO groups (id, name, pfp) VALUES ($1, $2, $3);`
	_, err := tx.Exec(ctx, stmt, groupId, groupName, pfp)
	return err
}

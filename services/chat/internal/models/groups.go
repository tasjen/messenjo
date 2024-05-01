package models

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

type IGroupModel interface {
	Add(ctx context.Context, tx pgx.Tx, groupId uuid.UUID, groupName string) error
}

type GroupModel struct{}

func NewGroupModel() *GroupModel {
	return &GroupModel{}
}

type Group struct {
	GroupId   uuid.UUID `db:"id"`
	GroupName string    `db:"name"`
}

func (m *GroupModel) Add(ctx context.Context, tx pgx.Tx, groupId uuid.UUID, groupName string) error {
	stmt := `INSERT INTO groups (id, name) VALUES ($1, $2);`
	_, err := tx.Exec(ctx, stmt, groupId, groupName)
	return err
}

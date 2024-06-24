package models

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type IGroupModel interface {
	Add(ctx context.Context, tx pgx.Tx, groupName, pfp string) (uuid.UUID, error)
	Update(ctx context.Context, groupId uuid.UUID, groupName, pfp string) error
}

type GroupModel struct {
	DB *pgxpool.Pool
}

func NewGroupModel(db *pgxpool.Pool) *GroupModel {
	return &GroupModel{DB: db}
}

type Group struct {
	GroupId   uuid.UUID `db:"id"`
	GroupName string    `db:"name"`
	Pfp       string    `db:"pfp"`
}

func (m *GroupModel) Add(ctx context.Context, tx pgx.Tx, groupName, pfp string) (uuid.UUID, error) {
	stmt := `
		INSERT INTO groups (id, name, pfp)
		VALUES ($1, $2, $3);`
	groupId := uuid.New()
	_, err := tx.Exec(ctx, stmt, groupId, groupName, pfp)
	return groupId, err
}

func (m *GroupModel) Update(ctx context.Context, groupId uuid.UUID, groupName, pfp string) error {
	stmt := `
		UPDATE "groups"
		SET name = $2, pfp = $3
		WHERE id = $1;`
	_, err := m.DB.Exec(ctx, stmt, groupId, groupName, pfp)
	return err
}

package models

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type User struct {
	ID       uuid.UUID `db:"id"`
	username string    `db:"username"`
}

type IUserModel interface {
	Add(ctx context.Context, username string) (uuid.UUID, error)
}

type UserModel struct {
	DB *pgxpool.Pool
}

func (m *UserModel) Add(ctx context.Context, username string) (uuid.UUID, error) {
	id := uuid.New()
	stmt := `INSERT INTO users (id, username) VALUES ($1, $2);`
	_, err := m.DB.Exec(ctx, stmt, id, username)
	if err != nil {
		return uuid.UUID{}, err
	}

	return id, nil
}

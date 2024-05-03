package models

import (
	"context"
	"fmt"
	"log"

	"github.com/google/uuid"
)

type IUserModel interface {
	Add(ctx context.Context, userId uuid.UUID, username string) error
	GetByUsername(ctx context.Context, username string) (uuid.UUID, error)
	GetById(ctx context.Context, userId uuid.UUID) (string, error)
	IsFriend(ctx context.Context, userId1, userId2 uuid.UUID) (bool, error)
}

type UserModel struct{}

func NewUserModel() *UserModel {
	return &UserModel{}
}

type User struct {
	UserId   uuid.UUID `db:"id"`
	Username string    `db:"username"`
}

func (m *UserModel) Add(ctx context.Context, userId uuid.UUID, username string) error {
	stmt := `INSERT INTO users (id, username) VALUES ($1, $2);`
	_, err := DB.Exec(ctx, stmt, userId, username)
	return err
}

func (m *UserModel) GetByUsername(ctx context.Context, username string) (uuid.UUID, error) {
	var userId uuid.UUID
	err := DB.QueryRow(ctx, `
		SELECT id FROM users WHERE username = $1;`, username).Scan(&userId)
	return userId, err
}

func (m *UserModel) GetById(ctx context.Context, userId uuid.UUID) (string, error) {
	var username string
	err := DB.QueryRow(ctx,
		`SELECT username FROM users WHERE id = $1`, userId).Scan(&username)
	return username, err
}

func (m *UserModel) IsFriend(ctx context.Context, userId1, userId2 uuid.UUID) (bool, error) {
	stmt := `
	SELECT COUNT(*) FROM groups
		JOIN members m1 ON groups.id = m1.group_id
		JOIN members m2 on groups.id = m2.group_id
		WHERE name = ''
  		AND m1.user_id = $1 
  		AND m2.user_id = $2;`

	var count int
	err := DB.QueryRow(ctx, stmt, userId1, userId2).Scan(&count)
	if err != nil {
		log.Println(err)
		return false, err
	}

	switch {
	case count == 0:
		return false, nil
	case count == 1:
		return true, nil
	default:
		err := fmt.Errorf("userId %v and userId %v share %v friends relationship", userId1, userId2, count)
		log.Println(err)
		return true, err
	}
}

package models

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgconn"
)

type IUserModel interface {
	Add(ctx context.Context, userId uuid.UUID, username, pfp string) error
	GetByUsername(ctx context.Context, username string) (User, error)
	GetById(ctx context.Context, userId uuid.UUID) (User, error)
	IsFriend(ctx context.Context, userId1, userId2 uuid.UUID) (bool, error)
	Update(ctx context.Context, userId uuid.UUID, username, pfp string) error
}

type UserModel struct{}

func NewUserModel() *UserModel {
	return &UserModel{}
}

type User struct {
	Id       uuid.UUID `db:"id"`
	Username string    `db:"username"`
	Pfp      string    `db:"pfp"`
}

func (m *UserModel) Add(ctx context.Context, userId uuid.UUID, username, pfp string) error {
	stmt := `INSERT INTO users (id, username, pfp) VALUES ($1, $2, $3);`
	_, err := DB.Exec(ctx, stmt, userId, username, pfp)
	var pgErr *pgconn.PgError
	if err != nil && errors.As(err, &pgErr) && pgErr.Code == "23505" {
		return &DupUsernameError{Username: username}
	}
	return err
}

func (m *UserModel) GetByUsername(ctx context.Context, username string) (User, error) {
	var user User
	err := DB.QueryRow(ctx, `
		SELECT * FROM users WHERE username = $1;`, username).Scan(&user.Id, &user.Username, &user.Pfp)
	return user, err
}

func (m *UserModel) GetById(ctx context.Context, userId uuid.UUID) (User, error) {
	var user User
	err := DB.QueryRow(ctx,
		`SELECT * FROM users WHERE id = $1`, userId).Scan(&user.Id, &user.Username, &user.Pfp)
	return user, err
}

func (m *UserModel) IsFriend(ctx context.Context, userId1, userId2 uuid.UUID) (bool, error) {
	stmt := `
	SELECT COUNT(*)
	FROM groups
		JOIN members m1
		ON groups.id = m1.group_id
		JOIN members m2
		ON groups.id = m2.group_id
	WHERE name = ''
  	AND m1.user_id = $1 
  	AND m2.user_id = $2;`

	var count int
	err := DB.QueryRow(ctx, stmt, userId1, userId2).Scan(&count)
	if err != nil {
		return false, err
	}

	switch {
	case count == 0:
		return false, nil
	case count == 1:
		return true, nil
	default:
		err := fmt.Errorf("userId %v and userId %v share %v friends relationship", userId1, userId2, count)
		return true, err
	}
}

func (m *UserModel) Update(ctx context.Context, userId uuid.UUID, username, pfp string) error {
	stmt := `
		UPDATE users
		SET username = $2, pfp = $3
		WHERE id = $1;`
	_, err := DB.Exec(ctx, stmt, userId, username, pfp)
	var pgErr *pgconn.PgError
	if err != nil && errors.As(err, &pgErr) && pgErr.Code == "23505" {
		return &DupUsernameError{Username: username}
	}
	return err
}

type DupUsernameError struct {
	Username string
}

func (err *DupUsernameError) Error() string {
	return fmt.Sprintf("username '%s' already exists", err.Username)
}

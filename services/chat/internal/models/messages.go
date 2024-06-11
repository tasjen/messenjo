package models

import (
	"context"
	"database/sql"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

type IMessageModel interface {
	GetFromGroupId(ctx context.Context, userId, groupId uuid.UUID) ([]Message, error)
	Add(ctx context.Context, tx pgx.Tx, userId, groupId uuid.UUID, content string, sentAt time.Time) (int32, string, string, error)
}

type MessageModel struct{}

func NewMessageModel() *MessageModel {
	return &MessageModel{}
}

type Message struct {
	Id           int            `db:"id"`
	FromUsername string         `db:"from_username"`
	FromPfp      sql.NullString `db:"from_pfp"`
	Content      string         `db:"content"`
	SentAt       time.Time      `db:"sent_at"`
}

func (m *MessageModel) GetFromGroupId(ctx context.Context, userId, groupId uuid.UUID) ([]Message, error) {
	stmt := `
		SELECT
			messages.id AS "id",
			users.username AS "fromUsername",
			CASE
				WHEN users.id = $1 THEN NULL
				ELSE users.pfp
			END AS "fromPfp",
			"content", sent_at
		FROM
			members
			JOIN messages
			ON members.group_id = messages.group_id
			JOIN users
			ON messages.user_id = users.id
		WHERE
			members.user_id = $1
			AND members.group_id = $2
		ORDER BY sent_at DESC;`

	rows, err := DB.Query(ctx, stmt, userId, groupId)
	if err != nil {
		return []Message{}, err
	}

	messages, err := pgx.CollectRows(rows, func(row pgx.CollectableRow) (Message, error) {
		var m Message
		err := row.Scan(&m.Id, &m.FromUsername, &m.FromPfp, &m.Content, &m.SentAt)
		return m, err
	})
	if err != nil {
		return []Message{}, err
	}

	return messages, nil
}

func (m *MessageModel) Add(ctx context.Context, tx pgx.Tx, userId, groupId uuid.UUID, content string, sentAt time.Time) (int32, string, string, error) {
	stmt := `
		WITH sent_message AS (
			INSERT INTO messages (user_id, group_id, content, sent_at)
			VALUES ($1, $2, $3, TO_TIMESTAMP($4))
			RETURNING *
		)
		
		SELECT sent_message.id, users.username, users.pfp
		FROM sent_message
		JOIN users
		ON sent_message.user_id = users.id
		WHERE users.id = $1;`
	var (
		id           int32
		fromUsername string
		fromPfp      string
	)
	err := tx.QueryRow(ctx, stmt, userId, groupId, content, float64(sentAt.UnixMilli())/1000).Scan(&id, &fromUsername, &fromPfp)
	return id, fromUsername, fromPfp, err
}

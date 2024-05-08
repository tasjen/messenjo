package models

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

type IMessageModel interface {
	GetFromGroupId(ctx context.Context, userId, groupId uuid.UUID) ([]Message, error)
	Add(ctx context.Context, userId, groupId uuid.UUID, content string, sentAt time.Time) (int32, error)
}

type MessageModel struct{}

func NewMessageModel() *MessageModel {
	return &MessageModel{}
}

type Message struct {
	Id           int       `db:"id"`
	FromUsername string    `db:"from_username"`
	Content      string    `db:"content"`
	SentAt       time.Time `db:"sent_at"`
}

func (m *MessageModel) GetFromGroupId(ctx context.Context, userId, groupId uuid.UUID) ([]Message, error) {
	stmt := `
		SELECT
			messages.id AS "id",
			users.username AS "fromUsername",
			"content", sent_at
		FROM (
			SELECT messages.id, messages.user_id, messages.group_id, "content", sent_at
			FROM messages
			JOIN members
			ON messages.group_id = members.group_id
			WHERE messages.group_id = $2
			AND members.user_id = $1
		) AS messages
		JOIN users
		ON users.id = messages.user_id
		ORDER BY "id";`

	rows, err := DB.Query(ctx, stmt, userId, groupId)
	if err != nil {
		return []Message{}, err
	}

	messages, err := pgx.CollectRows(rows, func(row pgx.CollectableRow) (Message, error) {
		var m Message
		err := row.Scan(&m.Id, &m.FromUsername, &m.Content, &m.SentAt)
		return m, err
	})
	if err != nil {
		return []Message{}, err
	}

	return messages, nil
}

// `sentAt` represents timestamp in milliseconds
func (m *MessageModel) Add(ctx context.Context, userId, groupId uuid.UUID, content string, sentAt time.Time) (int32, error) {
	stmt := `
		INSERT INTO messages (user_id, group_id, content, sent_at)
		VALUES ($1, $2, $3, TO_TIMESTAMP($4))
		RETURNING id;`
	var id int32
	err := DB.QueryRow(ctx, stmt, userId, groupId, content, float64(sentAt.UnixMilli())/1000).Scan(&id)
	return id, err
}

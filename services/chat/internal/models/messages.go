package models

import (
	"context"

	"github.com/google/uuid"
)

type IMessageModel interface {
	Add(ctx context.Context, userId, groupId uuid.UUID, content string, sentAt int64) error
}

type MessageModel struct{}

func NewMessageModel() *MessageModel {
	return &MessageModel{}
}

type Message struct {
	MessageId int       `db:"id"`
	UserId    uuid.UUID `db:"user_id"`
	GroupId   uuid.UUID `db:"group_id"`
	Content   string    `db:"content"`
	SentAt    string    `db:"sent_at"`
}

// `sentAt` represents timestamp in milliseconds
func (m *MessageModel) Add(ctx context.Context, userId, groupId uuid.UUID, content string, sentAt int64) error {
	stmt := `INSERT INTO messages (user_id, group_id, content, sent_at) VALUES ($1, $2, $3, TO_TIMESTAMP($4));`
	_, err := DB.Exec(ctx, stmt, userId, groupId, content, float64(sentAt)/1000)
	return err
}

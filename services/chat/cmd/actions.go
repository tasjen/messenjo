package main

type SendMessageAction struct {
	Type    string             `json:"type"`
	Payload SendMessagePayload `json:"payload"`
}

type SendMessagePayload struct {
	GroupId string `json:"groupId"`
	Message `json:"message"`
}

type Message struct {
	Id           int32  `json:"id"`
	FromUsername string `json:"fromUsername"`
	Content      string `json:"content"`
	SentAt       int64  `json:"sentAt"`
}

func NewSendMessageAction(groupId string, id int32, fromUsername, content string, sentAt int64) SendMessageAction {
	return SendMessageAction{
		Type: "SEND_MESSAGE",
		Payload: SendMessagePayload{
			GroupId: groupId,
			Message: Message{
				Id:           id,
				FromUsername: fromUsername,
				Content:      content,
				SentAt:       sentAt,
			},
		},
	}
}

// `Type` field is "ADD_CONTACT"
type AddContactAction struct {
	Type    string `json:"type"`
	Payload struct {
		GroupId string `json:"groupId"`
		Message struct {
			Id           int32  `json:"id"`
			FromUsername string `json:"fromUsername"`
			Content      string `json:"content"`
			SentAt       int64  `json:"sentAt"`
		}
	}
}

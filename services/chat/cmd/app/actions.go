package main

type AddMessageAction struct {
	Type    string            `json:"type"`
	Payload AddMessagePayload `json:"payload"`
}

type AddMessagePayload struct {
	ToGroupId string `json:"toGroupId"`
	Message   `json:"message"`
}

type Message struct {
	Id           int32  `json:"id"`
	FromUsername string `json:"fromUsername"`
	FromPfp      string `json:"fromPfp"`
	Content      string `json:"content"`
	SentAt       int64  `json:"sentAt"`
}

func NewAddMessageAction(toGroupId string, id int32, fromUsername, fromPfp, content string, sentAt int64) AddMessageAction {
	return AddMessageAction{
		Type: "ADD_MESSAGE",
		Payload: AddMessagePayload{
			ToGroupId: toGroupId,
			Message: Message{
				Id:           id,
				FromUsername: fromUsername,
				FromPfp:      fromPfp,
				Content:      content,
				SentAt:       sentAt,
			},
		},
	}
}

type AddContactAction struct {
	Type    string            `json:"type"`
	Payload AddContactPayload `json:"payload"`
}

type AddContactPayload struct {
	ToUserIds []string `json:"toUserIds"`
	Contact   `json:"contact"`
}

type Contact struct {
	Type        string `json:"type"`
	GroupId     string `json:"groupId"`
	UserId      string `json:"userId,omitempty"`
	Name        string `json:"name"`
	Pfp         string `json:"pfp"`
	MemberCount int    `json:"memberCount,omitempty"`
}

func NewAddFriendContactAction(toUserId, groupId, fromUserId, name, pfp string) AddContactAction {
	return AddContactAction{
		Type: "ADD_CONTACT",
		Payload: AddContactPayload{
			ToUserIds: []string{toUserId},
			Contact: Contact{
				Type:    "friend",
				GroupId: groupId,
				UserId:  fromUserId,
				Name:    name,
				Pfp:     pfp,
			},
		},
	}
}

func NewAddGroupContactAction(toUserIds []string, groupId, name, pfp string, memberCount int) AddContactAction {
	return AddContactAction{
		Type: "ADD_CONTACT",
		Payload: AddContactPayload{
			ToUserIds: toUserIds,
			Contact: Contact{
				Type:        "group",
				GroupId:     groupId,
				Name:        name,
				Pfp:         pfp,
				MemberCount: memberCount,
			},
		},
	}
}

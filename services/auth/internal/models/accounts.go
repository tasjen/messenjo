package models

import (
	"context"
	"errors"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

type IAccountModel interface {
	Get(ctx context.Context, userId string) (*Account, error)
	Add(ctx context.Context, acc *Account) error
	TableExists(ctx context.Context) (bool, error)
}

type AccountModel struct {
	DB        *dynamodb.Client
	TableName string
}

type Account struct {
	UserId       string `dynamodbav:"user_id"`
	ProviderName string `dynamodbav:"provider_name"`
	ProviderId   string `dynamodbav:"provider_id"`
	CreatedAt    string `dynamodbav:"created_at"`
}

func (acc *Account) GetKey() (map[string]types.AttributeValue, error) {
	userId, err := attributevalue.Marshal(acc.UserId)
	if err != nil {
		return map[string]types.AttributeValue{}, err
	}
	return map[string]types.AttributeValue{"user_id": userId}, nil
}

func (m *AccountModel) TableExists(ctx context.Context) (bool, error) {
	_, err := m.DB.DescribeTable(
		ctx, &dynamodb.DescribeTableInput{TableName: aws.String(m.TableName)})
	if err != nil {
		var notFoundErr *types.ResourceNotFoundException
		if errors.As(err, &notFoundErr) {
			return false, nil
		}
		return false, err
	}
	return true, nil
}

func (m *AccountModel) Get(ctx context.Context, userId string) (*Account, error) {
	acc := &Account{UserId: userId}
	accKey, err := acc.GetKey()
	if err != nil {
		return &Account{}, err
	}

	response, err := m.DB.GetItem(ctx, &dynamodb.GetItemInput{
		Key: accKey, TableName: aws.String(m.TableName),
	})
	if err != nil {
		return &Account{}, err
	}

	if len(response.Item) == 0 {
		return nil, nil
	}

	err = attributevalue.UnmarshalMap(response.Item, acc)
	if err != nil {
		return &Account{}, err
	}

	return acc, nil
}

func (m *AccountModel) Add(ctx context.Context, acc *Account) error {
	item, err := attributevalue.MarshalMap(acc)
	if err != nil {
		return err
	}
	_, err = m.DB.PutItem(ctx, &dynamodb.PutItemInput{
		TableName: aws.String(m.TableName), Item: item,
	})

	if err != nil {
		return err
	}

	return nil
}

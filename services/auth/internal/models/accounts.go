package models

import (
	"context"
	"log"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

type IAccountModel interface {
	Get(ctx context.Context, providerId, providerName string) (*Account, error)
	Add(ctx context.Context, acc *Account) error
	CreateTableIfNotExists(ctx context.Context) error
}

type AccountModel struct {
	DB        *dynamodb.Client
	TableName string
}

type Account struct {
	ProviderId   string `dynamodbav:"provider_id"`
	ProviderName string `dynamodbav:"provider_name"`
	UserId       string `dynamodbav:"user_id"`
	CreatedAt    string `dynamodbav:"created_at"`
}

func NewAccountModel(db *dynamodb.Client, tableName string) *AccountModel {
	return &AccountModel{DB: db, TableName: tableName}
}

func (acc *Account) GetKey() (map[string]types.AttributeValue, error) {
	providerId, err := attributevalue.Marshal(acc.ProviderId)
	if err != nil {
		return map[string]types.AttributeValue{}, err
	}

	providerName, err := attributevalue.Marshal(acc.ProviderName)
	if err != nil {
		return map[string]types.AttributeValue{}, err
	}

	return map[string]types.AttributeValue{
		"provider_id":   providerId,
		"provider_name": providerName,
	}, nil
}

func (m *AccountModel) tableExists(ctx context.Context) (bool, error) {
	tables, err := m.DB.ListTables(ctx, &dynamodb.ListTablesInput{})
	if err != nil {
		return false, err
	}
	for _, name := range tables.TableNames {
		if name == m.TableName {
			return true, nil
		}
	}
	return false, nil
}

func (m *AccountModel) CreateTableIfNotExists(ctx context.Context) error {
	exists, err := m.tableExists(ctx)
	if err != nil {
		return err
	}
	if exists {
		return nil
	}
	log.Printf("Table '%s' doesn't exists. Creating one...", m.TableName)
	_, err = m.DB.CreateTable(ctx, &dynamodb.CreateTableInput{
		TableName:   aws.String(m.TableName),
		TableClass:  types.TableClassStandard,
		BillingMode: types.BillingModeProvisioned,
		ProvisionedThroughput: &types.ProvisionedThroughput{
			ReadCapacityUnits:  aws.Int64(1),
			WriteCapacityUnits: aws.Int64(1),
		},
		AttributeDefinitions: []types.AttributeDefinition{
			{
				AttributeName: aws.String("provider_id"),
				AttributeType: types.ScalarAttributeTypeS,
			},
			{
				AttributeName: aws.String("provider_name"),
				AttributeType: types.ScalarAttributeTypeS,
			},
		},
		KeySchema: []types.KeySchemaElement{
			{
				AttributeName: aws.String("provider_id"),
				KeyType:       types.KeyTypeHash,
			},
			{
				AttributeName: aws.String("provider_name"),
				KeyType:       types.KeyTypeRange,
			},
		},
	})
	if err != nil {
		return err
	} else {
		waiter := dynamodb.NewTableExistsWaiter(m.DB)
		err = waiter.Wait(
			context.TODO(),
			&dynamodb.DescribeTableInput{TableName: aws.String(m.TableName)},
			5*time.Minute,
		)
		if err != nil {
			return err
		}
		log.Printf("Table '%s' has been successfully created", m.TableName)
		return nil
	}
}

func (m *AccountModel) Get(ctx context.Context, providerId, providerName string) (*Account, error) {
	acc := &Account{
		ProviderId:   providerId,
		ProviderName: providerName,
	}
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
		return &Account{}, nil
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

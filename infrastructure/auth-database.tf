resource "aws_dynamodb_table" "main" {
  name           = var.authdb_table_name
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "provider_id"
  range_key      = "provider_name"
  attribute {
    name = "provider_id"
    type = "S"
  }
  attribute {
    name = "provider_name"
    type = "S"
  }
  tags = {
    Name = "messenjo-authdb"
  }
}

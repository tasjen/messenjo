resource "aws_db_instance" "main" {
  identifier                 = "messenjo-chatdb"
  allocated_storage          = 20
  auto_minor_version_upgrade = true
  availability_zone          = "${var.region}a"
  multi_az                   = false
  engine                     = "postgres"
  engine_version             = "16.3"
  instance_class             = var.instance_class
  username                   = var.chatdb_username
  password                   = var.chatdb_password
  db_subnet_group_name       = aws_db_subnet_group.private.name
  parameter_group_name       = "default.postgres16"
  vpc_security_group_ids     = [aws_security_group.database.id]
  publicly_accessible        = false
  skip_final_snapshot        = true
  storage_encrypted          = true
  tags = {
    Name = "messenjo-chatdb"
  }
}

resource "aws_db_subnet_group" "private" {
  name       = "messenjo-private-group"
  subnet_ids = [aws_subnet.private_a.id, aws_subnet.private_b.id]
  tags = {
    Name = "messenjo-private-group"
  }
}

# Create a security group for our RDS instance to allow ingress connections from
# EC2 instances that allow egress connections referenced to this security group
resource "aws_security_group" "database" {
  name   = "messenjo-database-sg"
  vpc_id = aws_vpc.main.id
  tags = {
    Name = "messenjo-database-sg"
  }
}
resource "aws_vpc_security_group_ingress_rule" "server_to_db_5432" {
  security_group_id            = aws_security_group.database.id
  ip_protocol                  = "tcp"
  from_port                    = 5432
  to_port                      = 5432
  referenced_security_group_id = aws_security_group.server_to_database.id
  description                  = "Rule to allow connections from EC2 instances with ${aws_security_group.server_to_database.id} attached"
}

# Create a security group for EC2 instances that allows egress connections
# referenced to the above security group
resource "aws_security_group" "server_to_database" {
  name   = "messenjo-server-to-database-sg"
  vpc_id = aws_vpc.main.id
  tags = {
    Name = "messenjo-server-to-database-sg"
  }
}
resource "aws_vpc_security_group_egress_rule" "server_to_db_5432" {
  security_group_id            = aws_security_group.server_to_database.id
  ip_protocol                  = "tcp"
  from_port                    = 5432
  to_port                      = 5432
  referenced_security_group_id = aws_security_group.database.id
  description                  = "Rule to allow connections to messenjo-database from any instances this security group is attached to"
}

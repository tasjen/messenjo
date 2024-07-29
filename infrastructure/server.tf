resource "aws_instance" "main" {
  ami           = var.instance_ami
  instance_type = var.instance_type
  key_name      = "messenjo"
  subnet_id     = aws_subnet.public_a.id
  vpc_security_group_ids = [
    aws_security_group.server.id,
    aws_security_group.server_to_database.id,
  ]
  associate_public_ip_address = true

  root_block_device {
    volume_size = 8
    volume_type = "gp3"
  }
  # ebs_optimized = true # causes an error if using t2.micro
  user_data = file("setup.sh")
  tags = {
    Name = "messenjo-main-server"
  }
}

resource "aws_eip" "main" {
  instance             = aws_instance.main.id
  network_border_group = var.region
  tags = {
    Name = "messenjo-main-server-public-ipv4"
  }
}

resource "aws_security_group" "server" {
  name   = "messenjo-server-sg"
  vpc_id = aws_vpc.main.id
  tags = {
    Name = "messenjo-server-sg"
  }
}

resource "aws_vpc_security_group_ingress_rule" "internet_to_server_22" {
  security_group_id = aws_security_group.server.id
  ip_protocol       = "tcp"
  from_port         = 22
  to_port           = 22
  cidr_ipv4         = "0.0.0.0/0"
  description       = "Allow all SSH in"
}

resource "aws_vpc_security_group_ingress_rule" "internet_to_server_80" {
  security_group_id = aws_security_group.server.id
  ip_protocol       = "tcp"
  from_port         = 80
  to_port           = 80
  cidr_ipv4         = "0.0.0.0/0"
  description       = "Allow all HTTP in"
}

resource "aws_vpc_security_group_ingress_rule" "internet_to_server_443" {
  security_group_id = aws_security_group.server.id
  ip_protocol       = "tcp"
  from_port         = 443
  to_port           = 443
  cidr_ipv4         = "0.0.0.0/0"
  description       = "Allow all HTTPS in"
}

resource "aws_vpc_security_group_egress_rule" "server_to_internet_all" {
  security_group_id = aws_security_group.server.id
  ip_protocol       = -1
  cidr_ipv4         = "0.0.0.0/0"
  description       = "Allow all traffic out"
}

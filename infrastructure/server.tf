resource "aws_instance" "main" {
  ami           = var.instance_ami
  instance_type = var.instance_type
  key_name      = "messenjo"
  subnet_id     = aws_subnet.public_a.id
  vpc_security_group_ids = [
    aws_security_group.server.id,
    aws_security_group.server_to_database.id,
  ]
  iam_instance_profile        = aws_iam_instance_profile.main.name
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

# Create an elastic IP for the main server
resource "aws_eip" "main" {
  instance             = aws_instance.main.id
  network_border_group = var.region
  tags = {
    Name = "messenjo-main-server-public-ipv4"
  }
}

# Create the main security group for the main server
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

# Create a blank EC2 role
resource "aws_iam_role" "main" {
  name = "messenjo-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = "ec2.amazonaws.com"
        },
        Action = "sts:AssumeRole"
      }
    ]
  })
}
# Attach a policy for allowing SSM to access to an EC2 instance to the above EC2 role
resource "aws_iam_role_policy_attachment" "main" {
  role       = aws_iam_role.main.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}
# Create an instance profile for using in EC2 resources
resource "aws_iam_instance_profile" "main" {
  name = "messenjo-server-instance-profile"
  role = aws_iam_role.main.name
}


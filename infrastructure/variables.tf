variable "region" {
  type    = string
  default = "ap-southeast-1" # singapore
}

variable "authdb_table_name" {
  type = string
}

variable "chatdb_username" {
  type = string
}

variable "chatdb_password" {
  type = string
}

variable "instance_ami" {
  type        = string
  description = "AMI ID for the EC2 instance"
  default     = "ami-012c2e8e24e2ae21d" # Amazon Linux 2023 x86
}

variable "instance_type" {
  type        = string
  description = "Instance type for the EC2 instance"
  default     = "t2.micro" # 1vCPU 1GiB RAM
}

variable "key_name" {
  type        = string
  description = "Key pair name for connecting to the EC2 instance"
  default     = "messenjo"
  sensitive   = true
}

variable "instance_class" {
  type        = string
  description = "Instance class for the RDS instance"
  default     = "db.t3.micro" # 2vCPU 1GiB RAM (free tier)
}


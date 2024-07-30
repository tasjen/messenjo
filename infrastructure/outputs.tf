output "chatdb_uri" {
  value       = "postgresql://${aws_db_instance.main.username}:${aws_db_instance.main.password}@${aws_db_instance.main.endpoint}/postgres"
  sensitive   = true
  description = "used in Chat service"
}

output "main_server_public_ipv4" {
  value       = aws_eip.main.public_ip
  description = "used in DNS configuration and Taskfile"
}

output "main_server_instance_id" {
  value       = aws_instance.main.id
  description = "used in GitHub Actions deployment job"
}

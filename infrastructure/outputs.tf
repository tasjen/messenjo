output "chatdb_uri" {
  value     = "postgresql://${aws_db_instance.main.username}:${aws_db_instance.main.password}@${aws_db_instance.main.endpoint}/postgres"
  sensitive = true
}

output "main_server_public_ipv4" {
  value = aws_eip.main.public_ip
}

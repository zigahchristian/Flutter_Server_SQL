#!/bin/bash

# === Configuration ===
CONTAINER_NAME=docker_postgres
DB_NAME=mydatabase
DB_USER=postgres
BACKUP_FILE=backup_$(date +%Y%m%d_%H%M%S).sql

# === Backup Command ===
docker exec -t $CONTAINER_NAME pg_dump -U $DB_USER $DB_NAME > ./backups/$BACKUP_FILE

echo "✅ Backup saved to ./backups/$BACKUP_FILE"

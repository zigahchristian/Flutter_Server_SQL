#!/bin/bash

# === Configuration ===
CONTAINER_NAME=docker_postgres
DB_NAME=mydatabase
DB_USER=postgres
BACKUP_FILE=$1  # Pass filename as first argument

if [ -z "$BACKUP_FILE" ]; then
  echo "❌ Please provide a backup file to import. Usage: ./import.sh backup_file.sql"
  exit 1
fi

# === Import Command ===
cat ./backups/$BACKUP_FILE | docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME

echo "✅ Database restored from $BACKUP_FILE"


# ./import.sh backup_20250624_140012.sql
#!/bin/bash

# === Configuration ===
CONTAINER_NAME=docker_postgres
DB_NAME=mydatabase
DB_USER=postgres
EXPORT_FILE=schema_$(date +%Y%m%d_%H%M%S).sql

# === Export Command (Schema only) ===
docker exec -t $CONTAINER_NAME pg_dump -s -U $DB_USER $DB_NAME > ./backups/$EXPORT_FILE

echo "📤 Schema exported to ./backups/$EXPORT_FILE"


#backup.sh	Full DB backup	./backup.sh
#import.sh	Restore from backup	./import.sh backup_file.sql
#export.sh	Export schema only	./export.sh
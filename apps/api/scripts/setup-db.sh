DB_NAME=buildog
DB_USER=buildog

psql -U $DB_USER -d $DB_NAME -f schema.sql

echo "Database setup completed."

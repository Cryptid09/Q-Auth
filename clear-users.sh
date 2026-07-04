#!/bin/bash

echo "Clearing all users from the database..."

docker exec oppex-postgres psql -U oppex -d oppex_auth -c "TRUNCATE TABLE users CASCADE;"

echo "Done."

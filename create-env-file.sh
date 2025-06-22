#!/bin/bash
# Create canonical .env file for Ojala Healthcare Platform

cat > .env <<'EOF'
DB_CONNECTION_STRING=Host=ojala-db;Database=OjalaHealthcare;Username=ojala_user;Password=superSecure123
JWT_KEY=_32_byte_or_longer_random_string_for_production_use_
JWT_ISSUER=OjalaHealthcarePlatform
JWT_AUDIENCE=OjalaHealthcareClients
HEALTHSCORE_DB_CONN=Host=ojala-db;Database=OjalaHealthcare;Username=ojala_user;Password=superSecure123
AI_MODEL_PATH=/app/models/health-score-model.pkl
ASPNETCORE_ENVIRONMENT=Development
REDIS_CONNECTION_STRING=ojala-redis:6379
INFLUX_URL=http://influxdb:8086
INFLUX_TOKEN=ojala-influxdb-token
INFLUX_ORG=ojala
INFLUX_BUCKET=ojala_telemetry
VAULT_ADDR=http://vault:8200
VAULT_PATH=ojala-secrets
EOF

echo ".env file created successfully!"
echo "Remember to add .env to .gitignore if not already present."

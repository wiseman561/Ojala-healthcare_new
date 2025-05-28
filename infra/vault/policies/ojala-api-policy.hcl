# Vault Policy for Ojala API Service
# This policy defines permissions for the Ojala.Api service

# Allow reading database credentials
path "ojala/kv/data/database/connection" {
  capabilities = ["read"]
}

# Allow reading JWT configuration
path "ojala/kv/data/jwt" {
  capabilities = ["read"]
}

# Allow reading API keys and service credentials
path "ojala/kv/data/api-keys/*" {
  capabilities = ["read"]
}

# Allow database credential generation
path "ojala/database/creds/api-role" {
  capabilities = ["read"]
}

# Allow AWS credential generation for S3 access
path "ojala/aws/creds/s3-access" {
  capabilities = ["read"]
}

# Allow token creation for service-to-service communication
path "auth/token/create" {
  capabilities = ["create", "update"]
}

# Allow token renewal
path "auth/token/renew" {
  capabilities = ["update"]
}

# Allow token lookup for validation
path "auth/token/lookup" {
  capabilities = ["read"]
}

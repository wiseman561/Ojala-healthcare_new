# Vault Policy for Ojala Web Application
# This policy defines permissions for the Ojala.Web frontend application

# Allow reading frontend configuration
path "ojala/kv/data/web-config/*" {
  capabilities = ["read"]
}

# Allow reading API keys for external services
path "ojala/kv/data/api-keys/frontend/*" {
  capabilities = ["read"]
}

# Allow reading feature flags
path "ojala/kv/data/feature-flags/*" {
  capabilities = ["read"]
}

# Allow token renewal
path "auth/token/renew" {
  capabilities = ["update"]
}

# Allow token lookup for validation
path "auth/token/lookup" {
  capabilities = ["read"]
}

# Deny access to sensitive backend credentials
path "ojala/kv/data/database/*" {
  capabilities = ["deny"]
}

# Deny access to backend service credentials
path "ojala/database/creds/*" {
  capabilities = ["deny"]
}

#!/bin/bash

# Initialize Vault with secrets for the Ojala Healthcare Platform
# This script is for development purposes only

# Wait for Vault to be ready
until vault status > /dev/null 2>&1; do
  echo "Waiting for Vault to start..."
  sleep 1
done

# Enable Kubernetes auth method
vault auth enable kubernetes

# Configure Kubernetes auth method
vault write auth/kubernetes/config \
  kubernetes_host="https://kubernetes.default.svc" \
  token_reviewer_jwt="/var/run/secrets/kubernetes.io/serviceaccount/token" \
  kubernetes_ca_cert=@/var/run/secrets/kubernetes.io/serviceaccount/ca.crt \
  issuer="https://kubernetes.default.svc.cluster.local"

# Create policies for original services
vault policy write api-policy - <<EOF
path "ojala-secrets/data/api" {
  capabilities = ["read"]
}
EOF

vault policy write apigateway-policy - <<EOF
path "ojala-secrets/data/apigateway" {
  capabilities = ["read"]
}
EOF

vault policy write identity-policy - <<EOF
path "ojala-secrets/data/identity" {
  capabilities = ["read"]
}
EOF

# Create policies for new microservices
vault policy write ai-engine-policy - <<EOF
path "ojala-secrets/data/ai-engine" {
  capabilities = ["read"]
}
EOF

vault policy write nurse-assistant-policy - <<EOF
path "ojala-secrets/data/nurse-assistant" {
  capabilities = ["read"]
}
EOF

# Create roles for original services
vault write auth/kubernetes/role/api-role \
  bound_service_account_names=api \
  bound_service_account_namespaces=default \
  policies=api-policy \
  ttl=1h

vault write auth/kubernetes/role/apigateway-role \
  bound_service_account_names=apigateway \
  bound_service_account_namespaces=default \
  policies=apigateway-policy \
  ttl=1h

vault write auth/kubernetes/role/identity-role \
  bound_service_account_names=identity \
  bound_service_account_namespaces=default \
  policies=identity-policy \
  ttl=1h

# Create roles for new microservices
vault write auth/kubernetes/role/ai-engine-role \
  bound_service_account_names=ai-engine \
  bound_service_account_namespaces=default \
  policies=ai-engine-policy \
  ttl=1h

vault write auth/kubernetes/role/nurse-assistant-role \
  bound_service_account_names=nurse-assistant \
  bound_service_account_namespaces=default \
  policies=nurse-assistant-policy \
  ttl=1h

# Enable KV secrets engine
vault secrets enable -version=2 kv
vault secrets enable -path=ojala-secrets kv-v2

# Create secrets for original services
vault kv put ojala-secrets/api \
  connection_string="Server=sqlserver;Database=OjalaHealthcarePlatform;User Id=sa;Password=OjalaP@ssw0rd!;TrustServerCertificate=True" \
  jwt_secret_key="YourSuperSecretKeyHere_AtLeast32Characters" \
  jwt_issuer="OjalaHealthcarePlatform" \
  jwt_audience="OjalaHealthcarePlatformClients" \
  jwt_expiry_minutes=60 \
  smtp_server="smtp.example.com" \
  smtp_port=587 \
  sender_email="notifications@ojalahealthcare.com" \
  sender_name="Ojala Healthcare Platform"

vault kv put ojala-secrets/apigateway \
  connection_string="Server=sqlserver;Database=OjalaHealthcarePlatform;User Id=sa;Password=OjalaP@ssw0rd!;TrustServerCertificate=True" \
  jwt_secret_key="YourSuperSecretKeyHere_AtLeast32Characters" \
  jwt_issuer="OjalaHealthcarePlatform" \
  jwt_audience="OjalaHealthcarePlatformClients" \
  jwt_expiry_minutes=60 \
  api_base_url="http://api" \
  identity_base_url="http://identity"

vault kv put ojala-secrets/identity \
  connection_string="Server=sqlserver;Database=OjalaHealthcarePlatform;User Id=sa;Password=OjalaP@ssw0rd!;TrustServerCertificate=True" \
  jwt_secret_key="YourSuperSecretKeyHere_AtLeast32Characters" \
  jwt_issuer="OjalaHealthcarePlatform" \
  jwt_audience="OjalaHealthcarePlatformClients" \
  jwt_expiry_minutes=60

# Create secrets for new microservices
vault kv put ojala-secrets/ai-engine \
  connection_string="Server=sqlserver;Database=OjalaHealthcarePlatform;User Id=sa;Password=OjalaP@ssw0rd!;TrustServerCertificate=True" \
  openai_api_key="sk-youropenaiapikeyhere" \
  huggingface_api_key="hf_yourhfapikeyhere" \
  default_model="gpt-4" \
  temperature_setting=0.7 \
  max_tokens=2048 \
  data_lake_endpoint="http://datalake.ojala.internal" \
  feature_store_endpoint="http://featurestore.ojala.internal"

vault kv put ojala-secrets/nurse-assistant \
  connection_string="Server=sqlserver;Database=OjalaHealthcarePlatform;User Id=sa;Password=OjalaP@ssw0rd!;TrustServerCertificate=True" \
  notification_api_key="na_yourapikey" \
  ai_engine_endpoint="http://ai-engine" \
  patient_records_endpoint="http://api/patients" \
  alert_system_endpoint="http://alerts.ojala.internal" \
  critical_alert_threshold=90 \
  warning_alert_threshold=70 \
  notification_interval=15

echo "Vault initialization complete!"

pid_file = "/tmp/vault-agent.pid"

auto_auth {
  method "approle" {
    mount_path = "auth/approle"
    config = {
      role_id_file_path = "/vault/config/role-id"
      secret_id_file_path = "/vault/config/secret-id"
      remove_secret_id_file_after_reading = false
    }
  }
}

template {
  source      = "/vault/config/templates/jwt-secret.json.tpl"
  destination = "/vault/secrets/jwt-secret.json"
  perms       = 0644
}

vault {
  address = "http://vault:8200"
  tls_skip_verify = true
}

# Enable file watcher for secret rotation
template {
  source      = "/vault/config/templates/jwt-secret.json.tpl"
  destination = "/vault/secrets/jwt-secret.json"
  perms       = 0644
  command     = "echo 'Secret updated, restarting application...'"
}

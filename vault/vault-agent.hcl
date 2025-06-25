pid_file = "/tmp/vault-agent.pid"

auto_auth {
  method "token_file" {
    config = {
      token_file_path = "/vault/config/token"
    }
  }
}

template {
  source      = "/vault/config/templates/secrets.tmpl"
  destination = "/vault/secrets/appsettings.json"
  perms       = 0644
}

vault {
  address = "http://vault:8200"
  tls_skip_verify = true
}

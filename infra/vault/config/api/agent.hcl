exit_after_auth = false
pid_file = "/vault/agent/pidfile"

auto_auth {
  method "kubernetes" {
    mount_path = "auth/kubernetes"
    config = {
      role = "api-role"
    }
  }

  sink "file" {
    config = {
      path = "/vault/secrets/token"
    }
  }
}

template {
  source      = "/vault/config/appsettings.tpl"
  destination = "/vault/secrets/appsettings.json"
}

template {
  source      = "/vault/config/jwt-secret.tpl"
  destination = "/vault/secrets/jwt-secret.json"
}

vault {
  address = "http://vault:8200"
}

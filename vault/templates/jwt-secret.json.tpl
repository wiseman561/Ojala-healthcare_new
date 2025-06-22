{
  "secret": "{{ with secret "secret/jwt-secret" }}{{ .Data.data.secret }}{{ end }}",
  "issuer": "{{ with secret "secret/jwt-secret" }}{{ .Data.data.issuer }}{{ end }}",
  "audience": "{{ with secret "secret/jwt-secret" }}{{ .Data.data.audience }}{{ end }}",
  "expiry_minutes": "{{ with secret "secret/jwt-secret" }}{{ .Data.data.expiry_minutes }}{{ end }}"
}

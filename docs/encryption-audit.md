# Encryption Audit Findings

## Summary

This audit reviewed the encryption practices for sensitive data (PHI) within the Ojalá Healthcare Platform, focusing on encryption in transit (TLS/HTTPS) and encryption at rest (database).

## Encryption in Transit (TLS/HTTPS)

1.  **Ojala.Api**: The `Program.cs` file includes `app.UseHttpsRedirection()`, which is a good practice to enforce HTTPS connections to this service.
2.  **Ojala.ApiGateway**: The `Program.cs` file configures JWT Bearer authentication with `options.RequireHttpsMetadata = false;`. This is a **significant security risk** as it allows tokens to be potentially transmitted over unencrypted HTTP connections. This setting should be `true` in production environments to ensure tokens are only sent over HTTPS.
3.  **Ojala.Identity**: The `Startup.cs` file also configures JWT Bearer authentication with `options.RequireHttpsMetadata = false;`. Although there is a comment `// Set to true in production`, this is currently a **significant security risk** for development and testing environments and must be enforced in production.
4.  **Frontend Claims**: The `SecureMessagingPanel.js` component in the `rn-dashboard` frontend claims to use "HIPAA-compliant secure messaging" and that messages are "encrypted". However, no actual frontend encryption implementation (e.g., using Web Crypto API) was observed in the code. It likely relies solely on HTTPS for transit security.

## Encryption at Rest (Database)

1.  **OjalaDbContext.cs**: Examination of the `OjalaDbContext.cs` file, which defines the database models and relationships using Entity Framework Core, revealed **no explicit configuration for encryption at rest**. There is no evidence of:
    *   Column-level encryption for specific sensitive fields (e.g., using EF Core value converters with encryption functions).
    *   Configuration for Transparent Data Encryption (TDE) at the database level (though this is often configured outside the application code, at the database server or cloud provider level).
2.  **Sensitive Data**: The database contains numerous fields that would be considered PHI under HIPAA (e.g., Patient names, DOB, email, phone, address, diagnosis, treatment, notes, medication names, prescription details). The lack of explicit encryption at rest for this data is a **major security and compliance gap**.

## Recommendations

1.  **Enforce HTTPS**: Immediately change `RequireHttpsMetadata` to `true` in both `Ojala.ApiGateway` and `Ojala.Identity` configurations, even for development environments, or ensure the deployment environment strictly enforces HTTPS termination upstream (e.g., at the load balancer/ingress).
2.  **Implement Encryption at Rest**: Urgently implement encryption at rest for sensitive PHI data in the database. Options include:
    *   **Transparent Data Encryption (TDE)**: Configure TDE at the SQL Server level or via the cloud provider (e.g., Azure SQL Database TDE). This encrypts the entire database files.
    *   **Column-Level Encryption**: Use SQL Server Always Encrypted or implement application-level encryption using EF Core value converters and a secure key management solution (like Azure Key Vault or HashiCorp Vault) for specific sensitive columns.
3.  **Verify Frontend Claims**: Clarify the "encrypted" messaging claim in the frontend. If it only refers to TLS/HTTPS, update the UI text to be accurate. If client-side encryption is intended, it needs to be implemented correctly using appropriate cryptographic libraries and key management.
4.  **Key Management**: Establish and document secure key management practices for any encryption keys used (database encryption keys, application-level keys, etc.). Use a dedicated key management service (KMS) like Azure Key Vault or HashiCorp Vault.

## Next Steps

*   Document these findings in the main audit summary.
*   Update `todo.md`.

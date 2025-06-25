FROM hashicorp/vault:1.15.2

# Create necessary directories
RUN mkdir -p /vault/config/templates /vault/secrets

# Copy Vault Agent configuration
COPY vault-agent.hcl /vault/config/

# Copy template files
COPY templates/ /vault/config/templates/

# Create token file
RUN echo "root" > /vault/config/token

# Set proper permissions
RUN chmod 644 /vault/config/vault-agent.hcl && \
    chmod 644 /vault/config/templates/* && \
    chown -R vault:vault /vault/config /vault/secrets

# Switch to vault user
USER vault

# Expose port for health checks
EXPOSE 8200

# Start Vault Agent
ENTRYPOINT ["vault", "agent", "-config=/vault/config/vault-agent.hcl"]

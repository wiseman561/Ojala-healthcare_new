# OjalaHealthcarePlatform Best Practices Guide

This document outlines the best practices for development, testing, and maintenance of the OjalaHealthcarePlatform, ensuring consistent quality, maintainability, and efficiency across the codebase.

## Table of Contents

1. [Code Organization](#code-organization)
2. [Testing Best Practices](#testing-best-practices)
3. [Documentation Standards](#documentation-standards)
4. [CI/CD Implementation](#cicd-implementation)
5. [Error Handling](#error-handling)
6. [Dependency Management](#dependency-management)
7. [Code Review Process](#code-review-process)
8. [Acceptance Criteria](#acceptance-criteria)

## Code Organization

### File and Path Conventions

- **Be explicit about file paths and namespaces**
  - Use full paths in project references
  - Maintain consistent folder structure across projects
  - Follow standard naming conventions for all files

Example:
```csharp
// Place in: Ojala.Api.Tests/Controllers/AuthBridgeControllerTests.cs
namespace Ojala.Api.Tests.Controllers
{
    public class AuthBridgeControllerTests
    {
        // Test implementation
    }
}
```

### Component Structure

- Organize code by feature rather than by type
- Keep related files close together
- Use clear, descriptive names for all components
- Include README files in each major directory

## Testing Best Practices

### Unit Testing

- **Always include [Fact] or [Theory] attributes**
- **Test both happy and sad paths**
- **Use descriptive test names that explain the scenario and expected outcome**

Example:
```csharp
[Fact]
public async Task Login_WithValidCredentials_ReturnsToken()
{
    // Test implementation
}

[Fact]
public async Task Login_WithInvalidCredentials_Returns401Unauthorized()
{
    // Test implementation
}
```

### Integration Testing

- **Use WebApplicationFactory for API testing**
- **Provide concrete test data and mocks**
- **Test complete workflows across components**

Example:
```csharp
public class AuthBridgeIntegrationTests : IClassFixture<WebApplicationFactory<Startup>>
{
    private readonly WebApplicationFactory<Startup> _factory;
    
    public AuthBridgeIntegrationTests(WebApplicationFactory<Startup> factory)
    {
        _factory = factory
            .WithWebHostBuilder(builder =>
            {
                builder.ConfigureServices(services =>
                {
                    // Configure test services
                });
            });
    }
    
    [Fact]
    public async Task AuthFlow_ValidLegacyToken_ConvertsToNewJwt()
    {
        // Test implementation using _factory.CreateClient()
    }
}
```

### End-to-End Testing

- **Use fixtures for test data**
- **Test real user workflows**
- **Verify UI elements and API responses**

Example Cypress test:
```javascript
describe('RN Dashboard', () => {
  beforeEach(() => {
    cy.fixture('users.json').as('users');
    cy.get('@users').then((users) => {
      cy.visit('/login');
      cy.get('input[name=username]').type(users.rn.username);
      cy.get('input[name=password]').type(users.rn.password);
      cy.get('button[type=submit]').click();
    });
  });
  
  it('should display patient alerts', () => {
    cy.url().should('include', '/rn-dashboard');
    cy.get('.alert-card').should('have.length.at.least', 1);
  });
});
```

## Documentation Standards

### Code Comments

- **Include TODO markers for future improvements**
- **Document non-obvious code with inline comments**
- **Add summary comments for all public methods**

Example:
```csharp
// TODO: Replace mock URL with secrets from Vault
private readonly HttpClient _client = new HttpClient
{
    BaseAddress = new Uri("https://legacy-api.example.com")
};

/// <summary>
/// Validates a legacy token and converts it to a new JWT
/// </summary>
/// <param name="legacyToken">The legacy authentication token</param>
/// <returns>A new JWT token if validation succeeds, null otherwise</returns>
public async Task<string> ValidateLegacyTokenAsync(string legacyToken)
{
    // Implementation
}
```

### File Verification

- **Generate file lists for verification**
- **Include purpose descriptions for each file**
- **Verify file structure matches expected organization**

Example file list format:
```json
[
  {
    "path": "infra/monitoring/prometheus.yml",
    "description": "Prometheus configuration that scrapes metrics from all services"
  },
  {
    "path": "infra/monitoring/grafana/dashboards/overview.json",
    "description": "Grafana dashboard showing system-wide performance metrics"
  }
]
```

## CI/CD Implementation

### Breaking Down CI/CD Workflows

- **Implement CI/CD in small, focused jobs**
- **Verify each job independently**
- **Use consistent naming conventions**

Example GitHub Actions workflow structure:
```yaml
jobs:
  build:
    name: Build and Test
    runs-on: ubuntu-latest
    steps:
      # Build and test steps
  
  docker:
    name: Build Docker Images
    needs: build
    runs-on: ubuntu-latest
    steps:
      # Docker build steps
  
  deploy:
    name: Deploy Infrastructure
    needs: docker
    runs-on: ubuntu-latest
    steps:
      # Deployment steps
```

### Validation Clauses

- **Include validation steps in CI/CD workflows**
- **Use conditional checks to verify outputs**
- **Fail fast on critical errors**

Example validation step:
```yaml
- name: Validate Terraform
  run: |
    terraform validate
    if [ $? -ne 0 ]; then
      echo "Terraform validation failed"
      exit 1
    fi
```

## Error Handling

### Standardized Error Responses

- **Wrap all controller logic in try/catch blocks**
- **Return appropriate HTTP status codes**
- **Include detailed error information in responses**

Example:
```csharp
[HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginRequest request)
{
    try
    {
        var result = await _authService.AuthenticateAsync(request.Username, request.Password);
        if (result == null)
        {
            return Unauthorized(new { error = "Invalid credentials" });
        }
        return Ok(result);
    }
    catch (ValidationException ex)
    {
        return BadRequest(new { errors = ex.Errors });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error during login");
        return StatusCode(500, new { error = "An unexpected error occurred" });
    }
}
```

### Logging and Monitoring

- **Log all exceptions with appropriate context**
- **Use structured logging for easier querying**
- **Include correlation IDs for request tracking**

Example:
```csharp
try
{
    // Implementation
}
catch (Exception ex)
{
    _logger.LogError(ex, "Error processing request {RequestId} for user {UserId}", 
        HttpContext.TraceIdentifier, userId);
    throw;
}
```

## Dependency Management

### Version Locking

- **Specify exact versions for critical dependencies**
- **Document reasons for version constraints**
- **Regularly review and update dependencies**

Example:
```xml
<PackageReference Include="Swashbuckle.AspNetCore" Version="6.2.3" />
<PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="6.0.16" />
```

### Dependency Injection

- **Use constructor injection for dependencies**
- **Register services with appropriate lifetimes**
- **Avoid service locator pattern**

Example:
```csharp
public class AuthBridgeController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthBridgeController> _logger;
    
    public AuthBridgeController(
        IAuthService authService,
        ILogger<AuthBridgeController> logger)
    {
        _authService = authService;
        _logger = logger;
    }
    
    // Controller methods
}
```

## Code Review Process

### Summary Reports

- **Generate summary reports for code reviews**
- **Include metrics on changes and quality**
- **Highlight areas needing manual review**

Example summary report:
```markdown
| File | Purpose | Lines Added | Status |
|------|---------|-------------|--------|
| AuthBridgeController.cs | Handles authentication bridge requests | 124 | ✅ |
| IdentityBridgeService.cs | Implements identity mapping logic | 215 | ❌ Needs review |
| AuthBridgeControllerTests.cs | Tests for auth bridge controller | 187 | ✅ |
```

### Review Checklist

- **Verify all code meets style guidelines**
- **Ensure tests cover both happy and sad paths**
- **Check for proper error handling**
- **Validate documentation completeness**

## Acceptance Criteria

### Defining Clear Criteria

- **Include specific, measurable acceptance criteria for all tasks**
- **Verify criteria are met before marking tasks complete**
- **Document verification steps**

Example acceptance criteria:
```
Acceptance criteria for authentication bridge:
1. All tests must pass (dotnet test)
2. No compiler warnings
3. Code coverage > 80% for new code
4. Successful integration with legacy system verified
5. Performance meets SLA requirements (response time < 200ms)
```

### Automated Verification

- **Automate acceptance criteria verification where possible**
- **Include verification in CI/CD pipelines**
- **Generate reports showing criteria status**

Example verification step:
```yaml
- name: Verify Acceptance Criteria
  run: |
    echo "Running tests..."
    dotnet test --collect:"XPlat Code Coverage"
    
    echo "Checking code coverage..."
    coverage=$(grep -o 'Line coverage: [0-9.]*%' coverage.xml | cut -d' ' -f3 | tr -d '%')
    if (( $(echo "$coverage < 80" | bc -l) )); then
      echo "Code coverage below threshold: $coverage%"
      exit 1
    fi
    
    echo "All acceptance criteria met ✅"
```

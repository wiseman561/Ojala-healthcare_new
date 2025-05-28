# OjalaHealthcarePlatform Development Standards

This document outlines the development standards and coding conventions to be followed when working on the OjalaHealthcarePlatform. These standards ensure code quality, maintainability, and consistency across the codebase.

## Table of Contents

1. [Code Style and Formatting](#code-style-and-formatting)
2. [Naming Conventions](#naming-conventions)
3. [File Organization](#file-organization)
4. [Testing Requirements](#testing-requirements)
5. [Documentation Requirements](#documentation-requirements)
6. [Error Handling Standards](#error-handling-standards)
7. [Security Standards](#security-standards)
8. [Performance Standards](#performance-standards)
9. [Version Control Practices](#version-control-practices)
10. [Code Review Checklist](#code-review-checklist)

## Code Style and Formatting

### C# Code Style

- Use 4 spaces for indentation (not tabs)
- Place braces on new lines for methods, classes, and control blocks
- Use `var` only when the type is obvious from the right side of the assignment
- Keep lines under 120 characters in length
- Use expression-bodied members for simple one-liners
- Use pattern matching where appropriate

Example:
```csharp
public class Example
{
    private readonly IService _service;
    
    public Example(IService service)
    {
        _service = service ?? throw new ArgumentNullException(nameof(service));
    }
    
    public async Task<Result> ProcessDataAsync(string input)
    {
        if (string.IsNullOrEmpty(input))
        {
            throw new ArgumentException("Input cannot be null or empty", nameof(input));
        }
        
        var result = await _service.ProcessAsync(input);
        return result switch
        {
            null => Result.Failure("Processing failed"),
            _ => Result.Success(result)
        };
    }
}
```

### JavaScript/TypeScript Code Style

- Use 2 spaces for indentation
- Use semicolons at the end of statements
- Use single quotes for string literals
- Use template literals for string interpolation
- Use arrow functions for callbacks
- Use destructuring assignment where appropriate

Example:
```javascript
const processData = async (input) => {
  if (!input) {
    throw new Error('Input cannot be null or empty');
  }
  
  try {
    const { data } = await api.process(input);
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Processing failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
```

## Naming Conventions

### C# Naming Conventions

- Use PascalCase for class names, method names, and public properties
- Use camelCase for local variables and parameters
- Use _camelCase for private fields
- Use UPPER_CASE for constants
- Use PascalCase for interface names with 'I' prefix
- Use PascalCase for enum names and enum values

### JavaScript/TypeScript Naming Conventions

- Use PascalCase for class names and component names
- Use camelCase for variables, functions, and methods
- Use UPPER_CASE for constants
- Use kebab-case for file names
- Use camelCase for CSS class names in CSS-in-JS

### Database Naming Conventions

- Use PascalCase for table names (singular form)
- Use PascalCase for column names
- Use FK_TableName_ReferencedTable for foreign key constraints
- Use IX_TableName_ColumnName for indexes

## File Organization

### Project Structure

- Organize code by feature rather than by type
- Keep related files close together
- Use consistent folder naming across projects
- Include README files in each major directory

### C# Project Structure

```
Ojala.Api/
├── Controllers/
│   ├── AuthBridgeController.cs
│   ├── AiIntegrationController.cs
│   └── ...
├── Middleware/
│   ├── ExceptionHandlingMiddleware.cs
│   └── ...
├── Models/
│   ├── Requests/
│   ├── Responses/
│   └── ...
├── Extensions/
│   ├── ServiceCollectionExtensions.cs
│   └── ...
├── Program.cs
└── Startup.cs
```

### React Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── dashboard/
│   │   └── ...
│   ├── hooks/
│   ├── services/
│   ├── utils/
│   ├── pages/
│   ├── App.tsx
│   └── index.tsx
├── public/
└── package.json
```

## Testing Requirements

### Test Coverage Requirements

- Minimum 80% code coverage for all new code
- 100% coverage for critical components (authentication, data access)
- All public methods must have at least one test
- Both happy and sad paths must be tested

### Unit Testing Standards

- Test names should follow the pattern: `MethodName_Scenario_ExpectedResult`
- Each test should have clear Arrange, Act, Assert sections
- Use mocks for external dependencies
- Tests should be independent and not rely on other tests

Example:
```csharp
[Fact]
public async Task ValidateLegacyToken_WithValidToken_ReturnsUserInfo()
{
    // Arrange
    var token = "valid-token";
    var mockService = new Mock<IAuthService>();
    mockService.Setup(s => s.ValidateTokenAsync(token))
        .ReturnsAsync(new ValidationResult { IsValid = true, UserId = "user-123" });
    var controller = new AuthController(mockService.Object);
    
    // Act
    var result = await controller.ValidateToken(token);
    
    // Assert
    var okResult = Assert.IsType<OkObjectResult>(result);
    var response = Assert.IsType<ValidationResponse>(okResult.Value);
    Assert.True(response.IsValid);
    Assert.Equal("user-123", response.UserId);
}
```

### Integration Testing Standards

- Use WebApplicationFactory for API testing
- Test complete workflows across components
- Use in-memory databases for data access tests
- Test API endpoints with realistic data

### End-to-End Testing Standards

- Test critical user workflows
- Use realistic test data
- Verify both UI elements and API responses
- Test on multiple screen sizes for responsive design

## Documentation Requirements

### Code Documentation

- All public APIs must have XML documentation
- Include summary, parameter, and return value documentation
- Document exceptions that may be thrown
- Add examples for complex methods
- Use `<remarks>` for additional information

Example:
```csharp
/// <summary>
/// Validates a legacy authentication token and returns user information.
/// </summary>
/// <param name="token">The legacy token to validate.</param>
/// <returns>A validation result containing user information if valid.</returns>
/// <exception cref="ArgumentNullException">Thrown when token is null.</exception>
/// <remarks>
/// This method calls the legacy authentication service to validate the token.
/// If the token is valid, it returns user information including roles and claims.
/// </remarks>
public async Task<ValidationResult> ValidateLegacyTokenAsync(string token)
{
    // Implementation
}
```

### Project Documentation

- Each project must have a README.md file
- Include purpose, dependencies, and setup instructions
- Document configuration options
- Include examples of common usage
- Document known limitations or issues

### API Documentation

- Use Swagger/OpenAPI for API documentation
- Include descriptions for all endpoints
- Document request and response schemas
- Include example requests and responses
- Document authentication requirements

## Error Handling Standards

### Exception Handling

- Use specific exception types for different error scenarios
- Include meaningful error messages
- Log exceptions with appropriate context
- Don't catch exceptions unless you can handle them
- Use a global exception handler for API controllers

Example:
```csharp
public async Task<Result> ProcessDataAsync(string input)
{
    try
    {
        if (string.IsNullOrEmpty(input))
        {
            throw new ArgumentException("Input cannot be null or empty", nameof(input));
        }
        
        var result = await _service.ProcessAsync(input);
        return Result.Success(result);
    }
    catch (ServiceException ex)
    {
        _logger.LogError(ex, "Service error while processing data for {Input}", input);
        return Result.Failure($"Processing failed: {ex.Message}");
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Unexpected error while processing data for {Input}", input);
        throw; // Let the global handler deal with it
    }
}
```

### API Error Responses

- Use consistent error response format
- Include error code, message, and details
- Use appropriate HTTP status codes
- Include correlation ID for troubleshooting
- Don't expose sensitive information in error messages

Example error response:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request is invalid",
    "details": "The 'username' field is required",
    "correlationId": "abc123",
    "timestamp": "2025-04-24T23:06:36Z"
  }
}
```

## Security Standards

### Authentication and Authorization

- Use JWT tokens for authentication
- Implement role-based access control
- Use claims-based authorization for fine-grained control
- Validate all tokens on the server
- Implement token refresh mechanism

### Data Protection

- Use HTTPS for all communications
- Encrypt sensitive data at rest
- Use parameterized queries to prevent SQL injection
- Implement input validation for all user inputs
- Use Content Security Policy headers

### Secure Coding Practices

- Follow OWASP Top 10 guidelines
- Use security headers in all HTTP responses
- Implement rate limiting for API endpoints
- Use secure password hashing (bcrypt or Argon2)
- Implement proper session management

## Performance Standards

### API Performance

- Response time should be under 200ms for 95% of requests
- Use asynchronous programming for I/O operations
- Implement caching for frequently accessed data
- Use pagination for large data sets
- Optimize database queries

### Frontend Performance

- First Contentful Paint under 1.5 seconds
- Time to Interactive under 3 seconds
- Implement code splitting for large applications
- Optimize and compress images
- Use lazy loading for non-critical resources

## Version Control Practices

### Branching Strategy

- Use feature branches for all changes
- Branch naming: `feature/feature-name`, `bugfix/issue-description`
- Require pull requests for all changes
- Enforce code review before merging
- Keep branches short-lived (1-3 days)

### Commit Messages

- Use conventional commits format
- Include issue/ticket number in commit message
- Write descriptive commit messages
- Keep commits focused on a single change
- Squash commits before merging

Example:
```
feat(auth): implement legacy token validation (#123)

- Add token validation endpoint
- Integrate with legacy authentication service
- Add unit tests for validation logic
```

## Code Review Checklist

### Functionality

- [ ] Code works as expected
- [ ] Edge cases are handled
- [ ] Error handling is implemented
- [ ] Performance considerations are addressed

### Code Quality

- [ ] Code follows style guidelines
- [ ] No code smells or anti-patterns
- [ ] No duplicate code
- [ ] Appropriate use of design patterns

### Testing

- [ ] Unit tests are included
- [ ] Tests cover both happy and sad paths
- [ ] Tests are meaningful and not just for coverage
- [ ] Integration tests for API endpoints

### Security

- [ ] Input validation is implemented
- [ ] Authentication and authorization are properly handled
- [ ] No sensitive information is exposed
- [ ] Security best practices are followed

### Documentation

- [ ] Code is well-documented
- [ ] API documentation is updated
- [ ] README is updated if necessary
- [ ] Comments explain "why" not "what"

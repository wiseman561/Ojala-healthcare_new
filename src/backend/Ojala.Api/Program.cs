using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.IO;
using Ojala.Api.Extensions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Ojala.Data;
using Ojala.Contracts.Interfaces;
using Ojala.Api.Services;
using Ojala.Identity.Services;
using Ojala.Identity.Services.Interfaces;
using Ojala.Data.Repositories;
using Ojala.Data.Repositories.Interfaces;
using Ojala.Common.Email;
using Microsoft.AspNetCore.Identity;
using System.Runtime.CompilerServices;
using Ojala.Api.Hubs;
using Microsoft.AspNetCore.Authentication.JwtBearer;

// Make the Program class accessible for tests
[assembly: InternalsVisibleTo("Ojala.Tests.Integration")]

var builder = WebApplication.CreateBuilder(args);

// Configure Vault integration
var vaultEnabled = !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("VAULT_ADDR"));
if (vaultEnabled)
{
    // Check if we're running in Kubernetes
    var kubernetesServiceHost = Environment.GetEnvironmentVariable("KUBERNETES_SERVICE_HOST");
    var isKubernetes = !string.IsNullOrEmpty(kubernetesServiceHost);

    // Use Vault-provided configuration if available
    var vaultSecretsPath = "/vault/secrets/appsettings.secrets.json";
    if (File.Exists(vaultSecretsPath))
    {
        builder.Configuration.AddJsonFile(vaultSecretsPath, optional: false, reloadOnChange: true);
        Console.WriteLine("Loaded configuration from Vault secrets");
    }
    else
    {
        Console.WriteLine("Vault secrets file not found, using default configuration");

        // In Kubernetes, we would wait for the file to be available
        // For development with docker-compose, we'll use the token-based auth
        if (Environment.GetEnvironmentVariable("VAULT_TOKEN") != null)
        {
            Console.WriteLine("Using Vault token-based authentication for development");
        }
    }

    // Add Vault authentication service (no IConfiguration parameter)
    builder.Services.AddVaultAuthentication();
}

// Add database context
builder.Services.AddDbContext<Ojala.Data.ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddDbContext<Ojala.Data.OjalaDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentity<Ojala.Data.Entities.ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<Ojala.Data.ApplicationDbContext>()
    .AddDefaultTokenProviders();

// Configure authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer();

// Add authorization policies
builder.Services.AddAuthorizationPolicies();

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddSignalR(); // Add SignalR services
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Add application services
builder.Services.AddScoped<Ojala.Services.Interfaces.IPatientService, Ojala.Services.Implementations.PatientService>();
builder.Services.AddScoped<Ojala.Services.Interfaces.IAppointmentService, Ojala.Services.Implementations.AppointmentService>();
builder.Services.AddScoped<Ojala.Services.Interfaces.IMedicalRecordService, Ojala.Services.Implementations.MedicalRecordService>();
builder.Services.AddScoped<Ojala.Services.Interfaces.IHealthcarePlanService, Ojala.Services.Implementations.HealthcarePlanService>();

// Add 2FA services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ILoginOtpRepository, LoginOtpRepository>();
builder.Services.AddScoped<Ojala.Common.Email.IEmailService, Ojala.Common.Email.EmailService>();
builder.Services.AddScoped<Ojala.Identity.Services.Interfaces.IEmailService, Ojala.Identity.Services.EmailService>();

// Register other microservices
builder.Services.RegisterAIEngineServices(builder.Configuration);
builder.Services.RegisterNurseAssistantServices(builder.Configuration);

// Add AutoMapper
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

builder.Services.AddScoped<Ojala.Identity.Services.Interfaces.ITokenService, Ojala.Identity.Services.TokenService>();

var app = builder.Build();

// Apply database migrations in development
if (app.Environment.IsDevelopment())
{
    app.MigrateDatabase();
}

// Configure HTTP pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Map SignalR hub
app.MapHub<ChatHub>("/hubs/chat");

// Health check endpoint
app.MapGet("/health", () => Results.Ok(new { status = "healthy", service = "api" }));

app.Run();

// Create a partial Program class for WebApplicationFactory
namespace Ojala.Api
{
    public partial class Program { }
}

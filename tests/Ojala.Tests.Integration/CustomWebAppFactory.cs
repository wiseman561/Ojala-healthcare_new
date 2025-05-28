using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Ojala.Data;
using Microsoft.Extensions.Logging;
using System.Reflection;
using Ojala.Data.Repositories.Interfaces;
using Ojala.Data.Repositories;
using Moq;
using Microsoft.Extensions.Configuration;

namespace Ojala.Tests.Integration;

// Create a marker class for the WebApplicationFactory
public class ApiAssemblyMarker {}

// When targeting a minimal API with top-level statements
public class CustomWebAppFactory : WebApplicationFactory<Ojala.Api.Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        // Configure web host settings if needed
        builder.UseEnvironment("Testing");
        
        // Add test configuration
        builder.ConfigureAppConfiguration((context, configBuilder) =>
        {
            // Add in-memory configuration for testing
            var config = new Dictionary<string, string?>
            {
                // JWT settings to match TokenService expectations
                ["JwtSettings:Secret"] = "Z4tccK0JGnd7MwnUVTstw4jl0MXeRcIyi50SQFnPh0E=",
                ["JwtSettings:Issuer"] = "https://testapp.com",
                ["JwtSettings:Audience"] = "https://testapp.com",
                ["JwtSettings:ExpiryMinutes"] = "60",
                
                // For backwards compatibility
                ["JWT:ValidAudience"] = "https://testapp.com", 
                ["JWT:ValidIssuer"] = "https://testapp.com",
                ["JWT:Secret"] = "Z4tccK0JGnd7MwnUVTstw4jl0MXeRcIyi50SQFnPh0E=",
                ["JWT:TokenValidityInMinutes"] = "60",
                ["JWT:RefreshTokenValidityInDays"] = "7"
            };
            
            configBuilder.AddInMemoryCollection(config);
        });
        
        builder.ConfigureServices(services =>
        {
            // Find and remove the OjalaDbContext descriptor
            var ojalaDbContextDescriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<OjalaDbContext>));

            if (ojalaDbContextDescriptor != null)
            {
                services.Remove(ojalaDbContextDescriptor);
            }
            
            // Find and remove the ApplicationDbContext descriptor
            var appDbContextDescriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<ApplicationDbContext>));

            if (appDbContextDescriptor != null)
            {
                services.Remove(appDbContextDescriptor);
            }

            // Add DbContexts using in-memory database for testing
            services.AddDbContext<OjalaDbContext>(options =>
            {
                options.UseInMemoryDatabase("TestOjalaDb");
            });
            
            services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseInMemoryDatabase("TestAppDb");
            });

            // Register missing repository dependencies
            services.AddScoped<IUserProfileRepository, UserProfileRepository>();
            
            // Register other necessary mocks and dependencies
            services.AddScoped<Ojala.Services.Interfaces.IPatientService>(provider => 
                Mock.Of<Ojala.Services.Interfaces.IPatientService>());

            // Build the service provider to seed the database
            var sp = services.BuildServiceProvider();

            using (var scope = sp.CreateScope())
            {
                var scopedServices = scope.ServiceProvider;
                var ojalaDb = scopedServices.GetRequiredService<OjalaDbContext>();
                var appDb = scopedServices.GetRequiredService<ApplicationDbContext>();
                var logger = scopedServices.GetRequiredService<ILogger<CustomWebAppFactory>>();

                ojalaDb.Database.EnsureCreated();
                appDb.Database.EnsureCreated();

                try
                {
                    // Seed the database with test data if needed
                    InitializeDbForTests(ojalaDb);
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "An error occurred seeding the database. Error: {Message}", ex.Message);
                }
            }
        });
    }

    private void InitializeDbForTests(OjalaDbContext db)
    {
        // Add test data here if needed
        // For example, add test users
        db.SaveChanges();
    }
} 
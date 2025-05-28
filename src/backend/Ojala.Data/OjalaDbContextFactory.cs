using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace Ojala.Data
{
    public class OjalaDbContextFactory : IDesignTimeDbContextFactory<OjalaDbContext>
    {
        public OjalaDbContext CreateDbContext(string[] args)
        {
            // Build configuration
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development"}.json", optional: true)
                .AddEnvironmentVariables()
                .Build();

            // Get connection string
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            // Create DbContext options
            var optionsBuilder = new DbContextOptionsBuilder<OjalaDbContext>();
            optionsBuilder.UseSqlServer(connectionString);

            return new OjalaDbContext(optionsBuilder.Options);
        }
    }
}

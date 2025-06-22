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
            // Get connection string from environment variable
            var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING");

            // Create DbContext options
            var optionsBuilder = new DbContextOptionsBuilder<OjalaDbContext>();
            optionsBuilder.UseNpgsql(connectionString);

            return new OjalaDbContext(optionsBuilder.Options);
        }
    }
}

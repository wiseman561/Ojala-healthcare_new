using System.Text;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;

var builder = WebApplication.CreateBuilder(args);

// 1) Load Ocelot configuration
builder.Configuration.AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);

// 2) Configure JWT Bearer authentication for Ocelot
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.RequireHttpsMetadata = false;
        // The Authority can be your Identity API's URL
        options.Authority = builder.Configuration["JwtSettings:Authority"] ?? "https://localhost:59478";
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
            ValidateAudience = false,
            // If you want to validate audience, uncomment and set:
            // ValidAudience = builder.Configuration["JwtSettings:Audience"],
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:Secret"])
            ),
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

// 3) Register Ocelot
builder.Services.AddOcelot(builder.Configuration);

var app = builder.Build();

// 4) Middleware pipeline
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

// 5) Run Ocelot
await app.UseOcelot();

app.Run();

﻿using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

// your data & identity models
using Ojala.Data;                      // OjalaDbContext & ApplicationUser
// using Ojala.Data.Entities;             // ApplicationUser - removed due to namespace conflict
using Ojala.Data.Repositories;         // for LoginOtpRepository
using Ojala.Data.Repositories.Interfaces;  // for ILoginOtpRepository

// your services & extensions
using Ojala.Identity.Extensions;   // AddVaultAuthentication
using Ojala.Identity.Services;
using Ojala.Identity.Services.Interfaces;
using Ojala.Common.Email;          // for IEmailService / EmailService
using AutoMapper;

namespace Ojala.Identity
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // Called by the runtime. Use this to add services to the DI container.
        public void ConfigureServices(IServiceCollection services)
        {
            // 1) Entity Framework + Identity stores
            services.AddDbContext<OjalaDbContext>(opts =>
                opts.UseNpgsql(Configuration.GetConnectionString("DefaultConnection"))
            );
            services.AddDbContext<Ojala.Data.ApplicationDbContext>(opts =>
                opts.UseNpgsql(Configuration.GetConnectionString("DefaultConnection"))
            );


            services.AddIdentity<Ojala.Data.Entities.ApplicationUser, IdentityRole>(options =>
            {
                // tweak password / lockout rules here if you like
                options.Password.RequireDigit = true;
                options.Password.RequiredLength = 8;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = true;
                options.Password.RequireLowercase = true;
            })
            .AddEntityFrameworkStores<OjalaDbContext>()
            .AddDefaultTokenProviders();

            // 2) Vault integration (optional)
            var vaultEnabled = !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("VAULT_ADDR"));
            if (vaultEnabled)
            {
                services.AddVaultAuthentication(Configuration);
            }

            // 3) Your application services
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IUserProfileRepository, UserProfileRepository>();
            services.AddScoped<ILoginOtpRepository, LoginOtpRepository>();

            // 4) CORS
            services.AddCors(opts =>
            {
                opts.AddPolicy("AllowAll", policy =>
                    policy.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader());
            });
        }

        // Called by the runtime. Use this to configure the HTTP pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            // 1) Development-only middleware
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Ojala.Identity API V1")
                );
            }

            // 2) Common middleware
            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseCors("AllowAll");

            // 3) Auth
            app.UseAuthentication();
            app.UseAuthorization();

            // 4) Endpoints
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                // << no health-check here; it's in Program.cs >>
            });
        }
    }
}

using CashCraft.Data;
using CashCraft.Interface;
using CashCraft.Services;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using System.Text.Json;
using CashCraft.DTOs;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers()
    .ConfigureApiBehaviorOptions(options =>
    {
        // Validation errors use { message, errors } instead of ProblemDetails
        options.InvalidModelStateResponseFactory = context =>
        {
            var errors = context.ModelState
                .Where(e => e.Value?.Errors.Count > 0)
                .ToDictionary(
                    e => JsonNamingPolicy.CamelCase.ConvertName(e.Key.TrimStart('$', '.')),
                    e => e.Value!.Errors.Select(x => x.ErrorMessage).ToArray());

            var all = errors.Values.SelectMany(m => m).ToList();
            var message = all.Count == 1 ? all[0] : "Please fix the errors below.";

            return new BadRequestObjectResult(new MessageResponse(message, errors));
        };
    });
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContext<CashCraftDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IAccountsService, AccountService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IAccountsService, AccountService>();

builder.Services.AddHttpClient<PlaidService>(client =>
{
    client.BaseAddress = new Uri("https://sandbox.plaid.com");
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

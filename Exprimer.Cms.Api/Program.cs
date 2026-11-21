using Exprimer.Cms.Api.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddDbContext<CmsDbContext>(options =>
    options.UseInMemoryDatabase("ExprimerCms"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins(
                "http://localhost:4200",
                "https://localhost:4200",
                "https://exprimer.in",
                "https://www.exprimer.in",
                "http://deepakmehta206-001-site25.jtempurl.com",
                "https://deepakmehta206-001-site25.jtempurl.com")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<CmsDbContext>();
    db.Database.EnsureCreated();
    CmsSeeder.Seed(db);
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseDefaultFiles();
app.UseStaticFiles();
app.UseCors("Frontend");
app.MapControllers();
app.MapFallbackToFile("index.html");

app.Run();

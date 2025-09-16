using Microsoft.EntityFrameworkCore;
using DotnetAccountApi.Models;

namespace DotnetAccountApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        
    }
}

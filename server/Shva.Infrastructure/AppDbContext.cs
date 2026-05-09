using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Shva.Domain;

namespace Shva.Infrastructure;

public class AppDbContext : IdentityDbContext<AppUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Transaction> Transactions => Set<Transaction>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Transaction>(e =>
        {
            e.HasKey(t => t.Id);
            e.Property(t => t.UserId).IsRequired().HasMaxLength(450);
            e.Property(t => t.Region).IsRequired().HasMaxLength(8);
            e.Property(t => t.Status).HasConversion<int>();
            e.HasIndex(t => new { t.UserId, t.Status });
        });
    }
}

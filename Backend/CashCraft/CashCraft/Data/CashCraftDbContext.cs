using CashCraft.Models;
using Microsoft.EntityFrameworkCore;

namespace CashCraft.Data
{
    public class CashCraftDbContext : DbContext
    {
        public CashCraftDbContext(DbContextOptions<CashCraftDbContext> options) 
        : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();

        public DbSet<Account> Accounts => Set<Account>();

        public DbSet<Transaction> Transactions => Set<Transaction>();

        public DbSet<Budget> Budgets => Set<Budget>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Account>()
                .Property(a => a.CurrentBalance)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Account>()
                .Property(a => a.AvailableBalance)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Budget>()
                .Property(b => b.Limit)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Transaction>()
                .Property(t => t.Amount)
                .HasPrecision(18, 2);
        }
    }
}

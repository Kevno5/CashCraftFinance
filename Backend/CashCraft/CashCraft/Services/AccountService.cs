using CashCraft.Data;
using CashCraft.Interface;
using CashCraft.Models;
using Microsoft.EntityFrameworkCore;

namespace CashCraft.Services
{
    public class AccountService : IAccountsService
    {

        // Database context used to access the Accounts table
        private readonly CashCraftDbContext _context;

        // Constructor that gets the database context
        public AccountService(CashCraftDbContext context)
        {
            _context = context;
        }

        // Gets all accounts from the database
        public async Task<IEnumerable<Account>> GetAccountsAsync()
        {
            return await _context.Accounts.ToListAsync();
        }

        // Gets one account by its account ID
        public async Task<Account?> GetAccountByIdAsync(int id)
        {
            var account = await _context.Accounts
                .Where(c => c.Id == id)
                .FirstOrDefaultAsync();

            return account;
        }

        // Gets all accounts that belong to a specific user
        public async Task<List<Account>> GetAccountsByUserIdAsync(int userId)
        {
            return await _context.Accounts
                .Where(a => a.UserId == userId)
                .ToListAsync();
        }
    }
}

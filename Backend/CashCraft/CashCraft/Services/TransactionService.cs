using CashCraft.Data;
using CashCraft.Interface;
using CashCraft.Models;
using Microsoft.EntityFrameworkCore;



namespace CashCraft.Services
{
    public class TransactionService : ITransactionService
    {
        private readonly CashCraftDbContext _context;

        public TransactionService(CashCraftDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Transaction>> GetAllTransactionsAsync()
        {
            return await _context.Transactions.ToListAsync();
        }

        public async Task<List<Transaction>> GetTransactionsByUserIdAsync(int userId)
        {
            return await _context.Transactions
                .Where(t => t.Account!.UserId == userId)
                .ToListAsync();
        }

        public async Task<List<Transaction>> GetTransactionsByUserIdAndAccountId(int userId, int accountId)
        {
            return await _context.Transactions
                .Where(t => t.AccountId == accountId &&
                            t.Account!.UserId == userId)
                .OrderByDescending(t => t.Date)
                .ToListAsync();
        }
    }
}

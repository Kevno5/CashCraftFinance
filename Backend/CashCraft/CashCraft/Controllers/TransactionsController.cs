using CashCraft.Extensions;
using CashCraft.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CashCraft.Controllers
{
    [Authorize]
    [Route("api/Transactions")]
    [ApiController]
    public class TransactionsController : ControllerBase
    {
        public readonly ITransactionService _transactionService;

        public TransactionsController(ITransactionService transactionService)
        {
            _transactionService = transactionService;
        }

        // Returns only the logged-in user's transactions
        [HttpGet]
        public async Task<ActionResult> GetTransactions()
        {
            var currentUserId = User.GetUserId();
            if (currentUserId == null) return Unauthorized();

            var transactions = await _transactionService.GetTransactionsByUserIdAsync(currentUserId.Value);
            return Ok(transactions);
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult> GetTransactionsByUserId(int userId)
        {
            var currentUserId = User.GetUserId();
            if (currentUserId == null) return Unauthorized();
            if (userId != currentUserId.Value) return Forbid();

            var transactions = await _transactionService.GetTransactionsByUserIdAsync(userId);
            return Ok(transactions);
        }

        [HttpGet("user/{userId}/account/{accountId}")]
        public async Task<ActionResult> GetTransactionByUserIdAndAccountId(int userId, int accountId)
        {
            var currentUserId = User.GetUserId();
            if (currentUserId == null) return Unauthorized();
            if (userId != currentUserId.Value) return Forbid();

            var transactions = await _transactionService.GetTransactionsByUserIdAndAccountId(userId, accountId);
            return Ok(transactions);
        }
    }
}
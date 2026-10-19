using CashCraft.Interface;
using CashCraft.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CashCraft.Controllers
{
    [Route("api/Transactions")]
    [ApiController]

    public class TransactionsController : ControllerBase
    {

        public readonly ITransactionService _transactionService;

        public TransactionsController(ITransactionService transactionService)
        {
            _transactionService = transactionService;
        }

        [HttpGet]
        public async Task<ActionResult> GetTransactions()
        {
            var transactions = await _transactionService.GetAllTransactionsAsync();

            return Ok(transactions);
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult> GetTransactionsByUserId(int userId)
        {
            var transactions = await _transactionService.GetTransactionsByUserIdAsync(userId);

            return Ok(transactions);
        }

        [HttpGet("user/{userId}/account/{accountId}")]
        public async Task<ActionResult> GetTransactionByUserIdAndAccountId(int userId, int accountId)
        {
            var transactions = await _transactionService.GetTransactionsByUserIdAndAccountId(userId, accountId);

            return Ok(transactions);
        }



    }


}

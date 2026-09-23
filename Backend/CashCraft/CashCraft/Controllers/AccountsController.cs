using CashCraft.Interface;
using CashCraft.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CashCraft.Controllers
{
    [Route("api/Accounts")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        // Service used to handle account data
        private readonly IAccountsService _accountService;

        // Constructor that gets the account service
        public AccountsController(IAccountsService accountsService)
        {
            _accountService = accountsService;
        }

        // GET request to get every users accounts
        [HttpGet]
        public async Task<ActionResult> GetAccounts()
        {
            var accounts = await _accountService.GetAccountsAsync();
            return Ok(accounts);
        }

        // GET request to get one account by its account ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAccountById(int id)
        {
            var accounts = await _accountService.GetAccountByIdAsync(id);

            // Returns a 404 error if account does not exist
            if(accounts == null)
            {
                return NotFound();
            }
            return Ok(accounts);
        }

        // GET request to get all accounts that belong to a specific user
        [HttpGet("user/{userId}")]
        public async Task<ActionResult> GetAccountsByUserId(int userId)
        {
            var accounts = await _accountService.GetAccountsByUserIdAsync(userId);

            return Ok(accounts);
        }



    }
}

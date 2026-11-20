using CashCraft.Extensions;
using CashCraft.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CashCraft.Controllers
{
    [Authorize]
    [Route("api/Accounts")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        private readonly IAccountsService _accountService;

        public AccountsController(IAccountsService accountsService)
        {
            _accountService = accountsService;
        }

        // Returns only the logged-in user's accounts
        [HttpGet]
        public async Task<ActionResult> GetAccounts()
        {
            var currentUserId = User.GetUserId();
            if (currentUserId == null) return Unauthorized();

            var accounts = await _accountService.GetAccountsByUserIdAsync(currentUserId.Value);
            return Ok(accounts);
        }

        // Returns one account, only if it belongs to the logged-in user
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAccountById(int id)
        {
            var currentUserId = User.GetUserId();
            if (currentUserId == null) return Unauthorized();

            var account = await _accountService.GetAccountByIdAsync(id);

            if (account == null || account.UserId != currentUserId.Value)
            {
                return NotFound();
            }
            return Ok(account);
        }

        // Returns the accounts of a user, only if that user is the logged-in user
        [HttpGet("user/{userId}")]
        public async Task<ActionResult> GetAccountsByUserId(int userId)
        {
            var currentUserId = User.GetUserId();
            if (currentUserId == null) return Unauthorized();
            if (userId != currentUserId.Value) return Forbid();

            var accounts = await _accountService.GetAccountsByUserIdAsync(userId);
            return Ok(accounts);
        }
    }
}
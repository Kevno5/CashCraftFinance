using CashCraft.Extensions;
using CashCraft.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CashCraft.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PlaidController : ControllerBase
    {
        private readonly PlaidService _plaidService;

        public PlaidController(PlaidService plaidService)
        {
            _plaidService = plaidService;
        }

        [HttpPost("sandbox/create")]
        public async Task<IActionResult> CreateSandboxItem()
        {
            var publicToken =
                await _plaidService.CreateSandboxPublicTokenAsync();

            return Ok(new
            {
                publicToken
            });
        }

        [HttpPost("exchange/{userId}")]
        public async Task<IActionResult> ExchangePublicToken(
            int userId,
            [FromBody] PublicTokenRequest request)
        {
            if (User.GetUserId() != userId) return Forbid();

            var result =
                await _plaidService.ExchangePublicTokenAsync(
                    request.PublicToken,
                    userId
                );

            return Ok(result);
        }

        [HttpPost("save-accounts/{userId}")]
        public async Task<IActionResult> SaveAccounts(int userId)
        {
            if (User.GetUserId() != userId) return Forbid();

            await _plaidService.SavePlaidAccountsAsync(userId);

            return Ok("Plaid accounts saved");
        }

        [HttpPost("save-transactions/{userId}")]
        public async Task<IActionResult> SaveTransactions(int userId)
        {
            if (User.GetUserId() != userId) return Forbid();

            await _plaidService.SavePlaidTransactionsAsync(userId);
            return Ok("Transactions saved");
        }

        [HttpPost("link-token/{userId}")]
        public async Task<IActionResult> CreateLinkToken(int userId)
        {
            var linkToken = await _plaidService.CreateLinkTokenAsync(userId);
            return Ok(new { linkToken });
        }
    }

    public class PublicTokenRequest
    {
        public string PublicToken { get; set; } = string.Empty;
    }
}
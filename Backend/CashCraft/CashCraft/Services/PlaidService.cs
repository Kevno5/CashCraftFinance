using Azure.Core;
using CashCraft.Data;
using CashCraft.Models;
using Microsoft.EntityFrameworkCore;

namespace CashCraft.Services
{
    public class PlaidService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly CashCraftDbContext _context;

        public PlaidService(
            HttpClient httpClient,
            IConfiguration configuration,
            CashCraftDbContext context)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _context = context;
        }

        // Creates a sandbox public token for testing with plaid
        public async Task<string?> CreateSandboxPublicTokenAsync()
        {
            var request = new
            {
                client_id = _configuration["Plaid:ClientId"],
                secret = _configuration["Plaid:Secret"],
                institution_id = "ins_109508",

                initial_products = new[]
                {
                    "transactions"
                }
            };

            var response = await _httpClient.PostAsJsonAsync(
                "/sandbox/public_token/create",
                request
            );

            response.EnsureSuccessStatusCode();

            var result =
                await response.Content.ReadFromJsonAsync<SandboxPublicTokenResponse>();

            return result?.public_token;
        }

        // Exchanges the public token for an access token
        public async Task<PlaidTokenExchangeResponse?> ExchangePublicTokenAsync(string publicToken, int userId)
        {
            var request = new
            {
                client_id = _configuration["Plaid:ClientId"],
                secret = _configuration["Plaid:Secret"],
                public_token = publicToken
            };

            var response = await _httpClient.PostAsJsonAsync(
                "/item/public_token/exchange",
                request
            );

            response.EnsureSuccessStatusCode();

            var result = await response.Content
                .ReadFromJsonAsync<PlaidTokenExchangeResponse>();

            if(result == null ||
               result.access_token == null ||
               result.item_id == null)
            {
                return result;
            }

            var plaidItem = new PlaidItem
            {
                AccessToken = result.access_token,
                ItemId = result.item_id,
                UserId = userId
            };

            _context.PlaidItems.Add(plaidItem);

            await _context.SaveChangesAsync();

            return result;
        }

        // Gets all accounts connected to the Plaid access token
        public async Task<PlaidAccountsResponse?> GetAccountsAsync(string accessToken)
        {
            var request = new
            {
                client_id = _configuration["Plaid:ClientId"],
                secret = _configuration["Plaid:Secret"],
                access_token = accessToken
            };

            var response = await _httpClient.PostAsJsonAsync(
                "/accounts/get",
                request
            );

            response.EnsureSuccessStatusCode();

            return await response.Content.ReadFromJsonAsync<PlaidAccountsResponse>();
        }

        // Saves new Plaid accounts to the database and updates existing ones
        public async Task SavePlaidAccountsAsync(int userId)
        {
            var plaidItems = await _context.PlaidItems
                .Where(p => p.UserId == userId)
                .ToListAsync();

            if (plaidItems.Count == 0)
            {
                return;
            }

            foreach (var plaidItem in plaidItems)
            {
                var plaidResponse = await GetAccountsAsync(plaidItem.AccessToken);

                if (plaidResponse == null || plaidResponse.accounts == null)
                {
                    continue;
                }

                foreach (var plaidAccount in plaidResponse.accounts)
                {
                    var existingAccount = await _context.Accounts
                        .FirstOrDefaultAsync(a =>
                            a.PlaidAccountId == plaidAccount.account_id);

                    if (existingAccount == null)
                    {
                        var account = new Account
                        {
                            PlaidAccountId = plaidAccount.account_id,
                            Name = plaidAccount.name ?? string.Empty,
                            Type = plaidAccount.type ?? string.Empty,
                            Subtype = plaidAccount.subtype,
                            CurrentBalance = plaidAccount.balances?.current ?? 0,
                            AvailableBalance = plaidAccount.balances?.available,
                            CreditLimit = plaidAccount.balances?.limit,
                            UserId = userId
                        };

                        _context.Accounts.Add(account);
                    }
                    else
                    {
                        existingAccount.Name = plaidAccount.name ?? string.Empty;
                        existingAccount.Type = plaidAccount.type ?? string.Empty;
                        existingAccount.Subtype = plaidAccount.subtype;
                        existingAccount.CurrentBalance = plaidAccount.balances?.current ?? 0;
                        existingAccount.AvailableBalance = plaidAccount.balances?.available;
                        existingAccount.CreditLimit = plaidAccount.balances?.limit;
                    }
                }
            }

            await _context.SaveChangesAsync();
        }

        public async Task<PlaidTransactionsResponse?> GetTransactionsAsync(
            string accessToken,
            string? cursor = null)
        {
            var request = new
            {
                client_id = _configuration["Plaid:ClientId"],
                secret = _configuration["Plaid:Secret"],
                access_token = accessToken,
                cursor = cursor
            };

            var response = await _httpClient.PostAsJsonAsync(
                "/transactions/sync",
                request
            );

            response.EnsureSuccessStatusCode();

            return await response.Content
                .ReadFromJsonAsync<PlaidTransactionsResponse>();
        }

        public async Task SavePlaidTransactionsAsync(int userId)
        {
            var plaidItems = await _context.PlaidItems
                .Where(p => p.UserId == userId)
                .ToListAsync();

            if (plaidItems.Count == 0)
            {
                return;
            }

            foreach (var plaidItem in plaidItems)
            {
                bool hasMore;

                do
                {
                    var plaidResponse = await GetTransactionsAsync(
                        plaidItem.AccessToken,
                        plaidItem.TransactionCursor);

                    if (plaidResponse == null)
                    {
                        throw new Exception("Failed to retrieve Plaid transactions.");
                    }

                    foreach (var plaidTransaction in plaidResponse.added)
                    {
                        var existingTransaction = await _context.Transactions
                            .FirstOrDefaultAsync(t =>
                                t.PlaidTransactionId == plaidTransaction.transaction_id);

                        var account = await _context.Accounts
                            .FirstOrDefaultAsync(a =>
                                a.PlaidAccountId == plaidTransaction.account_id &&
                                a.UserId == userId);

                        if (account == null)
                        {
                            continue;
                        }

                        if (existingTransaction == null)
                        {
                            var transaction = new Transaction
                            {
                                PlaidTransactionId = plaidTransaction.transaction_id,
                                Name = plaidTransaction.name,
                                Amount = plaidTransaction.amount,
                                Date = plaidTransaction.date,
                                Category = plaidTransaction.category?.FirstOrDefault(),
                                PlaidPrimaryCategory = plaidTransaction.personal_finance_category?.primary,
                                PlaidDetailedCategory = plaidTransaction.personal_finance_category?.detailed,
                                CategoryConfidence = plaidTransaction.personal_finance_category?.confidence_level,
                                AccountId = account.Id
                            };

                            _context.Transactions.Add(transaction);
                        }
                        else
                        {
                            existingTransaction.Name = plaidTransaction.name;
                            existingTransaction.Amount = plaidTransaction.amount;
                            existingTransaction.Date = plaidTransaction.date;
                            existingTransaction.Category = plaidTransaction.category?.FirstOrDefault();
                            existingTransaction.AccountId = account.Id;

                            existingTransaction.PlaidPrimaryCategory =
                                plaidTransaction.personal_finance_category?.primary;

                            existingTransaction.PlaidDetailedCategory =
                                plaidTransaction.personal_finance_category?.detailed;

                            existingTransaction.CategoryConfidence =
                                plaidTransaction.personal_finance_category?.confidence_level;
                        }
                    }

                    foreach (var plaidTransaction in plaidResponse.modified)
                    {
                        var existingTransaction = await _context.Transactions
                            .FirstOrDefaultAsync(t =>
                                t.PlaidTransactionId == plaidTransaction.transaction_id);

                        if (existingTransaction == null)
                        {
                            continue;
                        }

                        var account = await _context.Accounts
                            .FirstOrDefaultAsync(a =>
                                a.PlaidAccountId == plaidTransaction.account_id &&
                                a.UserId == userId);

                        if (account == null)
                        {
                            continue;
                        }

                        existingTransaction.Name = plaidTransaction.name;
                        existingTransaction.Amount = plaidTransaction.amount;
                        existingTransaction.Date = plaidTransaction.date;
                        existingTransaction.Category = plaidTransaction.category?.FirstOrDefault();
                        existingTransaction.PlaidPrimaryCategory =
                            plaidTransaction.personal_finance_category?.primary;

                        existingTransaction.PlaidDetailedCategory =
                            plaidTransaction.personal_finance_category?.detailed;

                        existingTransaction.CategoryConfidence =
                            plaidTransaction.personal_finance_category?.confidence_level;
                        existingTransaction.AccountId = account.Id;
                    }

                    foreach (var removedTransaction in plaidResponse.removed)
                    {
                        var existingTransaction = await _context.Transactions
                            .FirstOrDefaultAsync(t =>
                                t.PlaidTransactionId == removedTransaction.transaction_id);

                        if (existingTransaction != null)
                        {
                            _context.Transactions.Remove(existingTransaction);
                        }
                    }

                    plaidItem.TransactionCursor = plaidResponse.next_cursor;

                    hasMore = plaidResponse.has_more;

                    await _context.SaveChangesAsync();
                }
                while (hasMore);
            }
        }

        public async Task<string?> CreateLinkTokenAsync(int userId)
        {
            var request = new
            {
                client_id = _configuration["Plaid:ClientId"],
                secret = _configuration["Plaid:Secret"],
                client_name = "CashCraft",
                user = new
                {
                    client_user_id = userId.ToString(),
                },
                products = new[] { "transactions" },
                country_codes = new[] { "US" },
                language = "en"
            };

            var response = await _httpClient.PostAsJsonAsync(
                "/link/token/create",
                request);

            response.EnsureSuccessStatusCode();

            var result = await response.Content
                .ReadFromJsonAsync<PlaidLinkToken> ();

            return result?.link_token;
        }

        // Stores the response from creating a sandbox public token
        public class SandboxPublicTokenResponse
        {
            public string? public_token { get; set; }
            public string? request_id { get; set; }
        }

        // Stores the response from exchanging a public token
        public class PlaidTokenExchangeResponse
        {
            public string? access_token { get; set; }
            public string? item_id { get; set; }
            public string? request_id { get; set; }
        }

        public class PlaidLinkToken
        {
            public string? link_token { get; set; }
        }
    }
}
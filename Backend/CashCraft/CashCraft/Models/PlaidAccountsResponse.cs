
namespace CashCraft.Models
{
    public class PlaidAccountsResponse
    {
        public List<PlaidAccount> accounts { get; set; } = new();
    }

    public class PlaidAccount
    {
        public string? account_id { get; set; }
        public string? name { get; set; }
        public string? type { get; set; }
        public string? subtype { get; set; }

        public PlaidBalances? balances { get; set; }
    }

    public class PlaidBalances
    {
        public decimal? available { get; set; }
        public decimal? current { get; set; }
        public decimal? limit { get; set; }
    }
}

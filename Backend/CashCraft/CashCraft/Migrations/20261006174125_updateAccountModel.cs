using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CashCraft.Migrations
{
    /// <inheritdoc />
    public partial class updateAccountModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PlaidAccountId",
                table: "Accounts",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PlaidAccountId",
                table: "Accounts");
        }
    }
}

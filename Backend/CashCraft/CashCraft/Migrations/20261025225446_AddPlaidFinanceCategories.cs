using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CashCraft.Migrations
{
    /// <inheritdoc />
    public partial class AddPlaidFinanceCategories : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CategoryConfidence",
                table: "Transactions",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PlaidDetailedCategory",
                table: "Transactions",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PlaidPrimaryCategory",
                table: "Transactions",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CategoryConfidence",
                table: "Transactions");

            migrationBuilder.DropColumn(
                name: "PlaidDetailedCategory",
                table: "Transactions");

            migrationBuilder.DropColumn(
                name: "PlaidPrimaryCategory",
                table: "Transactions");
        }
    }
}

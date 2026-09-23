using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CashCraft.Migrations
{
    /// <inheritdoc />
    public partial class AddMoreAttributes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "CreditLimit",
                table: "Accounts",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "MinimumPayment",
                table: "Accounts",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "PaymentDueDate",
                table: "Accounts",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Subtype",
                table: "Accounts",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreditLimit",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "MinimumPayment",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "PaymentDueDate",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "Subtype",
                table: "Accounts");
        }
    }
}

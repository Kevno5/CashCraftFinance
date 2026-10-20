using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CashCraft.Migrations
{
    /// <inheritdoc />
    public partial class AddedPlaidItemModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PlaidItem",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AccessToken = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ItemId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TransactionCursor = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlaidItem", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PlaidItem_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PlaidItem_UserId",
                table: "PlaidItem",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PlaidItem");
        }
    }
}

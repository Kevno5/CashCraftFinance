# CashCraft — Backend Setup Guide

This guide helps teammates run the CashCraft backend, set up their **own local SQL Server database**, create a test user with the existing registration endpoint, add fake account and transaction data, test APIs in Scalar, and connect the React frontend. It covers **using** registration to create test data, not how the registration code was implemented.

> **Each teammate has their own local database.** Pulling GitHub code gives you the models and EF Core migrations, **not** another teammate's account or transaction records. You do **not** need Plaid credentials just to run the backend or build the frontend with sample data.

## 1. Install what you need

- **Visual Studio** with ASP.NET and web development support, or another editor configured for C#.
- **.NET 10 SDK** (our backend targets `net10.0`).
- **SQL Server** (Developer or Express is fine) and **SQL Server Management Studio (SSMS)**.
- **Git**.
- **EF Core command-line tool**. If needed, run:

  ```powershell
  dotnet tool install --global dotnet-ef
  ```

  If it's already installed, use `dotnet tool update --global dotnet-ef` instead.

## 2. Get the project

Clone the CashCraftFinance repository from GitHub, or, if you already have it, pull the latest merged code:

```powershell
git switch main
git pull origin main
```

Open the CashCraft solution in Visual Studio. The backend project folder is:

```text
Backend/CashCraft/CashCraft/
```

Run the terminal commands below from that folder (the folder with `CashCraft.csproj`). Make sure the Plaid integration pull request has been merged before expecting its endpoints and migrations on `main`.

## 3. Connect to your own local SQL Server

First, use SSMS to check which SQL Server instance you can connect to:

- Default instance: often `localhost`.
- SQL Server Express: often `localhost\SQLEXPRESS`.

Our project's `appsettings.json` uses this default connection:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=CashCraftDb;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

If yours uses a different instance, **do not change and commit the shared `appsettings.json` just for your computer**. In Visual Studio, right-click the CashCraft backend project → **Manage User Secrets**, and add your local override, for example:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=CashCraftDb;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

The double backslash is required in JSON. User Secrets are local to your computer and work when the environment is `Development`. If you later add Plaid credentials, put them in the **same** `secrets.json` object without replacing your connection string.

## 4. Create your database with EF Core

Make sure SQL Server is running, then open a terminal in the backend project folder and run:

```powershell
dotnet restore
dotnet ef database update
```

This applies the team's migrations and creates/updates **your local** `CashCraftDb`. We have tested the combined migrations against a fresh SQL Server database.

In SSMS, connect to the **same SQL Server instance** as the connection string, then refresh **Databases → CashCraftDb → Tables**. Important tables include:

- `Users`
- `Accounts`
- `Transactions`
- `PlaidItem`
- `__EFMigrationsHistory` (EF Core's migration tracking; **don't delete or edit this table**)

## 5. Start the backend and use Scalar

1. Set the CashCraft ASP.NET Core project as the **startup project** in Visual Studio.
2. Start the backend using the **HTTPS** launch profile.
3. Note the localhost address/port shown by Visual Studio, for example `https://localhost:PORT`.
4. Open **`https://localhost:PORT/scalar/v1`**, using the actual port.

Scalar lists the API endpoints and lets you send test requests and inspect responses. It is available when the app is running in **Development**. If HTTPS shows a certificate warning, you may need to trust the local .NET development certificate (`dotnet dev-certs https --trust`).

### Existing API endpoints

| HTTP method and route | What it does |
| --- | --- |
| `POST /api/auth/register` | Creates a test user in your local database |
| `GET /api/Accounts` | Returns all saved accounts (testing only) |
| `GET /api/Accounts/{id}` | Returns an account by its database ID |
| `GET /api/Accounts/user/{userId}` | Returns all saved accounts belonging to a user |
| `GET /api/Transactions` | Returns all saved transactions (testing only) |
| `GET /api/Transactions/user/{userId}` | Returns transactions across all accounts belonging to a user |
| `GET /api/Transactions/user/{userId}/account/{accountId}` | Returns transactions for one specific account belonging to a user |
| `POST /api/Plaid/sandbox/create` | Generates a Plaid Sandbox public token |
| `POST /api/Plaid/exchange/{userId}` | Exchanges a public token and saves the connection |
| `POST /api/Plaid/save-accounts/{userId}` | Imports/updates accounts in SQL Server |
| `POST /api/Plaid/save-transactions/{userId}` | Imports/updates transactions in SQL Server |

**TransactionsController is now available.** The frontend can retrieve saved transactions from SQL Server using the GET routes above. These routes currently use user IDs supplied in the URL for local testing and are not yet protected by user-based authorization.

## 6. Create a test user through Scalar

The backend already has a registration endpoint, so **do not manually insert users into SQL Server**. You can use it just to create a user for your sample account data; no login is needed for this test.

1. Run the backend and open Scalar (`https://localhost:PORT/scalar/v1`, replacing `PORT` with your backend's port).
2. Find **`POST /api/auth/register`**, click **Test Request**, and enter this JSON request body:

   ```json
   {
     "name": "Test User",
     "email": "testuser@example.com",
     "password": "Password123"
   }
   ```

3. Execute the request. A successful registration returns **`201 Created`** with a success message. If you get a conflict because the email is already in your database, use a different test email. The password must contain at least 8 characters, including a letter and a number.
4. In SSMS, open a query against **your own database** (`CashCraftDb` by default) and run:

   ```sql
   SELECT Id, Name, Email FROM dbo.Users;
   ```

5. Find your new user's actual **`Id`**. You will use it for the sample accounts below. Do **not** assume it is always `1`.

The registration endpoint hashes the password and stores the new user in your local database. This section only covers **testing** registration; the teammate responsible for that feature can explain its implementation.

## 7. Give your local database fake data (recommended for frontend work)

**Frontend teammates do not need a Plaid account or Plaid secrets.** They just need sample records associated with the test user you created in Step 6.

### Sample accounts

In SSMS, select your `CashCraftDb` database. Here is an optional example that adds two sample accounts for an existing user. **Replace `1` with your actual user ID before running.** Run this only once unless you want duplicate test rows.

```sql
DECLARE @UserId int = 1; -- CHANGE THIS to your own user's ID

IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE Id = @UserId)
    THROW 50001, 'User does not exist. Check @UserId.', 1;

INSERT INTO dbo.Accounts
    (Name, Type, Subtype, CurrentBalance, AvailableBalance,
     CreditLimit, MinimumPayment, PaymentDueDate, PlaidAccountId, UserId)
VALUES
    ('Sample Checking', 'depository', 'checking', 2500.00, 2450.00,
     NULL, NULL, NULL, NULL, @UserId),
    ('Sample Credit Card', 'credit', 'credit card', 300.00, 1700.00,
     2000.00, 25.00, NULL, NULL, @UserId);
```

### Sample transactions

Check your account IDs first:

```sql
SELECT Id, Name, UserId FROM dbo.Accounts;
```

Then use the **actual** ID of the sample checking account in this example (replace `1`).

```sql
DECLARE @AccountId int = 1; -- CHANGE THIS to the checking account's ID

IF NOT EXISTS (SELECT 1 FROM dbo.Accounts WHERE Id = @AccountId)
    THROW 50002, 'Account does not exist. Check @AccountId.', 1;

INSERT INTO dbo.Transactions
    (Name, Amount, Date, Category, AccountId, PlaidTransactionId)
VALUES
    ('Walmart', 65.20, '2026-10-01', 'Groceries', @AccountId, NULL),
    ('Coffee Shop', 7.50, '2026-10-02', 'Food', @AccountId, NULL);
```

These records are **fake local development data**, not actual Plaid-imported data. Since they have no Plaid IDs, they are suitable for testing displays without a Plaid connection. The examples assume your migrated schema matches the project code.

To see what was saved:

```sql
SELECT Id, Name, Type, CurrentBalance, AvailableBalance, UserId
FROM dbo.Accounts;

SELECT Id, Name, Amount, Date, Category, AccountId
FROM dbo.Transactions;
```

Then open Scalar and verify your fake data using these endpoints (replace the placeholders with the IDs you looked up in SSMS):

1. `GET /api/Accounts/user/{userId}` — displays the test user's saved accounts.
2. `GET /api/Transactions/user/{userId}` — displays transactions from all that user's accounts.
3. `GET /api/Transactions/user/{userId}/account/{accountId}` — displays transactions from only the selected account.

For the sample records, the third endpoint should return the Walmart and Coffee Shop transactions when you supply the sample checking account's ID. A `200 OK` response with `[]` means no matching transactions were found. These GET endpoints read your local SQL Server data; they do not contact Plaid.

## 8. Optional: Test Plaid Sandbox integration

**Only needed if you're testing the Plaid integration itself.** Plaid Sandbox supplies **fake** bank accounts and transactions. The teammates working only on React can skip this section.

For approved team Sandbox credentials, open **Manage User Secrets** and add:

```json
{
  "Plaid": {
    "ClientId": "YOUR_SANDBOX_CLIENT_ID",
    "Secret": "YOUR_SANDBOX_SECRET"
  }
}
```

If your secrets file already has a `ConnectionStrings` section, **keep it** and add `Plaid` alongside it. Don't commit or paste secret values into GitHub or GroupMe. The app's Plaid API base URL is `https://sandbox.plaid.com`.

With a test user already in your database, use Scalar in this order:

1. `POST /api/Plaid/sandbox/create` — copy the returned `publicToken` privately.
2. `POST /api/Plaid/exchange/{userId}` — replace `{userId}` with your test user's ID. Send JSON such as:

   ```json
   { "publicToken": "PASTE_YOUR_PUBLIC_TOKEN_HERE" }
   ```

3. `POST /api/Plaid/save-accounts/{userId}` — saves the Sandbox accounts to your database.
4. `POST /api/Plaid/save-transactions/{userId}` — saves the Sandbox transactions; **import accounts first** so transaction records have a matching account.

**The save endpoints return success messages, not the account/transaction lists.** Check the results in SSMS. You can also use `GET /api/Accounts/user/{userId}` to see the imported accounts. The current exchange endpoint can return a sensitive access token: do **not** share its response or expose these Sandbox testing endpoints publicly.

To inspect connected Items without viewing access tokens:

```sql
SELECT Id, UserId, TransactionCursor FROM dbo.PlaidItem;
```

## 9. Connecting React to the backend

React should make HTTP requests to the **ASP.NET Core API**, not directly to SQL Server. Example (replace the port and user ID with your local values):

```javascript
const response = await axios.get(
  'https://localhost:PORT/api/Accounts/user/1'
);
console.log(response.data);
```

For transaction data, React can similarly use:

```javascript
const response = await axios.get(
  'https://localhost:PORT/api/Transactions/user/1'
);
console.log(response.data);
```

For transactions on just one account, use `GET /api/Transactions/user/{userId}/account/{accountId}`. Replace the example IDs with IDs from your own local database.

The React app and backend will normally run on different localhost ports; a cross-origin request may require CORS configuration in the backend. These ID-based routes are for local testing and **do not yet prevent someone from requesting another user's data**. Authentication and per-user authorization must be added before exposing the API publicly.

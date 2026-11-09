using CashCraft.Data;
using CashCraft.DTOs;
using CashCraft.Interface;
using CashCraft.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CashCraft.Services
{
    public class AuthService : IAuthService
    {
        private readonly CashCraftDbContext _db;
        private readonly IJwtTokenService _jwt;
        private readonly PasswordHasher<User> _hasher = new();

        public AuthService(CashCraftDbContext db, IJwtTokenService jwt)
        {
            _db = db;
            _jwt = jwt;
        }

        public async Task<RegisterResult> RegisterAsync(RegisterRequest request)
        {
            if (!request.Password.Any(char.IsLetter) || !request.Password.Any(char.IsDigit))
                return new RegisterResult(false, "Password must contain at least one letter and one number.", false, "password");
            var email = request.Email.Trim().ToLowerInvariant();

            if (await _db.Users.AnyAsync(u => u.Email == email))
                return new RegisterResult(false, "An account with this email already exists.", true, "email");

            var user = new User { Name = request.Name.Trim(), Email = email };
            user.PasswordHash = _hasher.HashPassword(user, request.Password);

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return new RegisterResult(true, "Account created successfully. You can now log in.", false);
        }

        public async Task<LoginResult> LoginAsync(LoginRequest request)
        {
            var email = request.Email.Trim().ToLowerInvariant();
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
                return new LoginResult(false, "Invalid email or password.", null, null, null, null);

            var check = _hasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);

            if (check == PasswordVerificationResult.Failed)
                return new LoginResult(false, "Invalid email or password.", null, null, null, null);

            var token = _jwt.CreateToken(user);
            return new LoginResult(true, "Login successful.", user.Id, user.Name, user.Email, token);
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            return await _db.Users.FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<ChangePasswordResult> ChangePasswordAsync(int userId, ChangePasswordRequest request)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return new ChangePasswordResult(false, "User not found.");

            var check = _hasher.VerifyHashedPassword(user, user.PasswordHash, request.CurrentPassword);
            if (check == PasswordVerificationResult.Failed)
                return new ChangePasswordResult(false, "Current password is incorrect.", "currentPassword");

            if (!request.NewPassword.Any(char.IsLetter) || !request.NewPassword.Any(char.IsDigit))
                return new ChangePasswordResult(false, "Password must contain at least one letter and one number.", "newPassword");

            if (request.NewPassword == request.CurrentPassword)
                return new ChangePasswordResult(false, "New password must be different from the current password.", "newPassword");

            user.PasswordHash = _hasher.HashPassword(user, request.NewPassword);
            await _db.SaveChangesAsync();

            return new ChangePasswordResult(true, "Password changed successfully.");
        }
    }
}
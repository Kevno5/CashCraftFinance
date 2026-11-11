import { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";
import "./Pages.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { getMe, changePassword } from "../api/authApi";
import type { ChangePasswordErrors } from "../api/authApi";
import { getAccountsByUserId } from "../api/accountsApi";
import type { Account } from "../types/account";
import PlaidLinkButton from "./PlaidLinkButton";

export default function Settings() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  // Profile
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");

  // Preferences (front-end only for now)
  const [currency, setCurrency] = useState("USD");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);

  // Linked accounts
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [accountsError, setAccountsError] = useState("");

  // Change password
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<ChangePasswordErrors & { confirm?: string }>({});
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Load profile from GET /api/auth/me
  useEffect(() => {
    async function loadProfile() {
      try {
        const me = await getMe();
        setName(me.name);
        setEmail(me.email);
      } catch {
        setProfileError("Could not load your profile.");
      } finally {
        setProfileLoading(false);
      }
    }
    loadProfile();
  }, []);

  // Load linked accounts from GET /api/Accounts/user/{userId}
  async function loadAccounts() {
    if (!user) return;
    setAccountsLoading(true);
    setAccountsError("");
    try {
      const data = await getAccountsByUserId(user.id);
      setAccounts(data);
    } catch {
      setAccountsError("Could not load linked accounts.");
    } finally {
      setAccountsLoading(false);
    }
  }

  useEffect(() => {
    loadAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  function handleLogout() {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    setUser(null);
    navigate("/login", { replace: true });
  }

  function resetPasswordForm() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordErrors({});
    setPasswordMessage("");
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordErrors({});
    setPasswordMessage("");
    setPasswordSuccess("");

    // checks before calling the backend
    const errors: ChangePasswordErrors & { confirm?: string } = {};
    if (!currentPassword) errors.currentPassword = "Enter your current password.";
    if (!newPassword) errors.newPassword = "Enter a new password.";
    if (newPassword && newPassword !== confirmPassword) errors.confirm = "Passwords do not match.";
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setPasswordSaving(true);
    try {
      const res = await changePassword(currentPassword, newPassword);
      setPasswordSuccess(res.message || "Password changed.");
      resetPasswordForm();
      setShowPasswordForm(false);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 400) {
        const data = err.response.data as { message?: string; errors?: ChangePasswordErrors };
        setPasswordErrors(data.errors ?? {});
        setPasswordMessage(data.message ?? "Could not change password.");
      } else {
        setPasswordMessage("Unable to connect to the backend.");
      }
    } finally {
      setPasswordSaving(false);
    }
  }

  return (
    <main className="cc-main">
      <header className="cc-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your profile, preferences and linked accounts.</p>
        </div>
      </header>

      <div className="cc-settings">
        {/* ---------- Profile ---------- */}
        <form className="cc-card cc-form" onSubmit={(e) => e.preventDefault()}>
          <h2>Profile</h2>
          {profileLoading ? (
            <p className="cc-subtext">Loading profile…</p>
          ) : (
            <div className="cc-form-grid">
              <label>
                Name
                <input value={name} onChange={(e) => setName(e.target.value)} disabled />
              </label>
              <label>
                Email
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled />
              </label>
            </div>
          )}
          {profileError && <p className="cc-error-text">{profileError}</p>}
          {/* TODO: enable when the backend has an update-profile endpoint */}
          <button type="submit" className="cc-btn-primary" disabled title="Coming soon">
            Save Changes
          </button>
          <p className="cc-subtext">Editing your name and email is coming soon.</p>
        </form>

        {/* ---------- Preferences ---------- */}
        <div className="cc-card">
          <h2>Preferences</h2>
          <div className="cc-setting-row">
            <div>
              <div className="cc-setting-title">Currency</div>
              <div className="cc-subtext">Used to display all amounts</div>
            </div>
            <select className="cc-select" value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
          <div className="cc-setting-row">
            <div>
              <div className="cc-setting-title">Email notifications</div>
              <div className="cc-subtext">Weekly summary of your spending</div>
            </div>
            <Toggle checked={emailAlerts} onChange={setEmailAlerts} label="Email notifications" />
          </div>
          <div className="cc-setting-row">
            <div>
              <div className="cc-setting-title">Budget alerts</div>
              <div className="cc-subtext">Warn me when I'm close to a budget limit</div>
            </div>
            <Toggle checked={budgetAlerts} onChange={setBudgetAlerts} label="Budget alerts" />
          </div>
        </div>

        {/* ---------- Linked Accounts ---------- */}
        <div className="cc-card">
          <div className="cc-goal-top">
            <h2>Linked Accounts</h2>
            <PlaidLinkButton onLinked={loadAccounts} />
          </div>

          {accountsLoading && <p className="cc-subtext">Loading accounts…</p>}
          {accountsError && <p className="cc-error-text">{accountsError}</p>}
          {!accountsLoading && !accountsError && accounts.length === 0 && (
            <p className="cc-subtext">No bank accounts linked yet.</p>
          )}

          <ul className="cc-activity-list">
            {accounts.map((a) => (
              <li key={a.id}>
                <div className="cc-activity-text">
                  <div className="cc-activity-name">{a.name}</div>
                  <div className="cc-activity-meta">
                    {a.type === "credit" ? "Credit card" : "Bank account"}
                    {a.subtype ? ` · ${a.subtype}` : ""}
                  </div>
                </div>
                <div className="cc-activity-amount">
                  ${a.currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* ---------- Security ---------- */}
        <div className="cc-card">
          <h2>Security</h2>
          <div className="cc-setting-row">
            <div>
              <div className="cc-setting-title">Password</div>
              <div className="cc-subtext">Change the password you use to log in</div>
            </div>
            {!showPasswordForm && (
              <button
                className="cc-btn-secondary"
                onClick={() => {
                  setPasswordSuccess("");
                  setShowPasswordForm(true);
                }}
              >
                Change Password
              </button>
            )}
          </div>

          {passwordSuccess && <p className="cc-success-text">{passwordSuccess}</p>}

          {showPasswordForm && (
            <form className="cc-form cc-password-form" onSubmit={handleChangePassword}>
              <label>
                Current password
                <input
                  type="password"
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                {passwordErrors.currentPassword && (
                  <span className="cc-error-text">{passwordErrors.currentPassword}</span>
                )}
              </label>

              <label>
                New password
                <input
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                {passwordErrors.newPassword && (
                  <span className="cc-error-text">{passwordErrors.newPassword}</span>
                )}
              </label>

              <label>
                Confirm new password
                <input
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {passwordErrors.confirm && <span className="cc-error-text">{passwordErrors.confirm}</span>}
              </label>

              {passwordMessage && <p className="cc-error-text">{passwordMessage}</p>}

              <div className="cc-btn-row">
                <button type="submit" className="cc-btn-primary" disabled={passwordSaving}>
                  {passwordSaving ? "Saving…" : "Update Password"}
                </button>
                <button
                  type="button"
                  className="cc-btn-secondary"
                  onClick={() => {
                    resetPasswordForm();
                    setShowPasswordForm(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="cc-setting-row">
            <div>
              <div className="cc-setting-title">Log out</div>
              <div className="cc-subtext">Sign out of Cash Craft on this device</div>
            </div>
            <button className="cc-btn-danger" onClick={handleLogout}>Log Out</button>
          </div>
        </div>
      </div>
    </main>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`cc-toggle ${checked ? "on" : ""}`}
      onClick={() => onChange(!checked)}
    >
      <span className="cc-toggle-knob" />
    </button>
  );
}
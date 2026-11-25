import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import "./Pages.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { getMe, changePassword } from "../api/authApi";

// TODO: load from GET /api/Accounts/user/{userId}
const sampleLinkedAccounts = [
  { id: 1, name: "Sample Checking", type: "depository" },
  { id: 2, name: "Sample Credit Card", type: "credit" },
];

export default function Settings() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [message, setMessage] = useState("");

  // Change password form
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Load the logged-in user's profile from the backend
  useEffect(() => {
    let cancelled = false;

    getMe()
      .then((me) => {
        if (cancelled) return;
        setName(me.name);
        setEmail(me.email);
      })
      .catch(() => {
        if (!cancelled) setMessage("Could not load your profile.");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function handleLogout() {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");

    setUser(null);

    navigate("/login", { replace: true });
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword || !newPassword) {
      setPasswordError("Please fill in both password fields.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    if (!/[A-Za-z]/.test(newPassword) || !/\d/.test(newPassword)) {
      setPasswordError("Password must contain at least one letter and one number.");
      return;
    }

    setPasswordLoading(true);
    try {
      const result = await changePassword(currentPassword, newPassword);
      setPasswordSuccess(result.message || "Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setShowPasswordForm(false);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setPasswordError(err.response.data.message);
      } else {
        setPasswordError("Could not change the password. Please try again.");
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <main className="cc-main">
      <header className="cc-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your profile, preferences and linked accounts.</p>
        </div>
      </header>

      <div className="cc-settings">
        <form className="cc-card cc-form" onSubmit={(e) => e.preventDefault()}>
          <h2>Profile</h2>
          <div className="cc-form-grid">
            <label>
              Name
              <input value={name} readOnly />
            </label>
            <label>
              Email
              <input type="email" value={email} readOnly />
            </label>
          </div>
          {message && <p className="cc-subtext">{message}</p>}
          {/* TODO: make editable once the backend has a profile update endpoint */}
          <p className="cc-subtext">Editing your profile is not available yet.</p>
        </form>

        <div className="cc-card">
          <h2>Preferences</h2>
          <div className="cc-setting-row">
            <div>
              <div className="cc-setting-title">Currency</div>
              <div className="cc-subtext">Used to display all amounts</div>
            </div>
            <select className="cc-select" value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (&euro;)</option>
              <option value="GBP">GBP (&pound;)</option>
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

        <div className="cc-card">
          <div className="cc-goal-top">
            <h2>Linked Accounts</h2>
            {/* TODO: open Plaid Link once the frontend Plaid flow exists */}
            <button className="cc-btn-primary">Link Bank Account</button>
          </div>
          <ul className="cc-activity-list">
            {sampleLinkedAccounts.map((a) => (
              <li key={a.id}>
                <div className="cc-activity-text">
                  <div className="cc-activity-name">{a.name}</div>
                  <div className="cc-activity-meta">{a.type === "credit" ? "Credit card" : "Bank account"}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="cc-card">
          <h2>Security</h2>
          <div className="cc-setting-row">
            <div>
              <div className="cc-setting-title">Password</div>
              <div className="cc-subtext">Change the password you use to log in</div>
            </div>
            <button
              className="cc-btn-secondary"
              onClick={() => {
                setShowPasswordForm(!showPasswordForm);
                setPasswordError("");
                setPasswordSuccess("");
              }}
            >
              {showPasswordForm ? "Cancel" : "Change Password"}
            </button>
          </div>

          {passwordSuccess && <p className="cc-subtext">{passwordSuccess}</p>}

          {showPasswordForm && (
            <form className="cc-form" onSubmit={handleChangePassword}>
              <div className="cc-form-grid">
                <label>
                  Current password
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                </label>
                <label>
                  New password
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </label>
              </div>
              {passwordError && <p className="cc-subtext" role="alert">{passwordError}</p>}
              <button type="submit" className="cc-btn-primary" disabled={passwordLoading}>
                {passwordLoading ? "Saving..." : "Save Password"}
              </button>
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
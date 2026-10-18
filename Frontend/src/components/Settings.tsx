import { useState } from "react";
import Sidebar, { type Page } from "./Sidebar";
import "./Dashboard.css";
import "./Pages.css";

// TODO: load from GET /api/Users/{userId} (or the login response) once login is merged
const sampleUser = { name: "Alex Mercer", email: "alex@example.com" };

// TODO: load from GET /api/Accounts/user/{userId}
const sampleLinkedAccounts = [
  { id: 1, name: "Sample Checking", type: "depository" },
  { id: 2, name: "Sample Credit Card", type: "credit" },
];

type SettingsProps = {
  onNavigate?: (page: Page) => void;
};

export default function Settings({ onNavigate }: SettingsProps) {
  const [name, setName] = useState(sampleUser.name);
  const [email, setEmail] = useState(sampleUser.email);
  const [currency, setCurrency] = useState("USD");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [message, setMessage] = useState("");

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.includes("@")) {
      setMessage("Please enter a name and a valid email.");
      return;
    }
    // TODO: PUT /api/Users/{userId} once the backend has it
    setMessage("Saved (not sent to the backend yet).");
  };

  return (
    <div className="cc-shell">
      <Sidebar active="Settings" onNavigate={onNavigate} />

      <main className="cc-main">
        <header className="cc-header">
          <div>
            <h1>Settings</h1>
            <p>Manage your profile, preferences and linked accounts.</p>
          </div>
        </header>

        <div className="cc-settings">
          <form className="cc-card cc-form" onSubmit={handleSaveProfile}>
            <h2>Profile</h2>
            <div className="cc-form-grid">
              <label>
                Name
                <input value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <label>
                Email
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>
            </div>
            {message && <p className="cc-subtext">{message}</p>}
            <button type="submit" className="cc-btn-primary">Save Changes</button>
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
              {/* TODO: needs a change-password endpoint */}
              <button className="cc-btn-secondary" disabled>Change Password</button>
            </div>
            <div className="cc-setting-row">
              <div>
                <div className="cc-setting-title">Log out</div>
                <div className="cc-subtext">Sign out of Cash Craft on this device</div>
              </div>
              {/* TODO: clear the saved login token once login is merged */}
              <button className="cc-btn-danger" disabled>Log Out</button>
            </div>
          </div>
        </div>
      </main>
    </div>
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

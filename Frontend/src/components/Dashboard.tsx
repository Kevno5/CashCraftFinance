import "./Dashboard.css";

// ---- Icons (inline SVG, no extra dependency needed) ----
const Icon = {
  Grid: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  List: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <circle cx="3.5" cy="6" r="1" fill="currentColor" />
      <circle cx="3.5" cy="12" r="1" fill="currentColor" />
      <circle cx="3.5" cy="18" r="1" fill="currentColor" />
    </svg>
  ),
  Pie: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2a10 10 0 1 0 10 10H12V2Z" />
      <path d="M21.5 8.5A10 10 0 0 0 15.5 2.5v6h6Z" />
    </svg>
  ),
  Target: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  ),
  Chart: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="4" y1="20" x2="4" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="20" y1="20" x2="20" y2="14" />
    </svg>
  ),
  Gear: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1Z" />
    </svg>
  ),
  Card: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  ),
  Cart: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.5 3h2l2.4 12.4a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21.5 7H6" />
    </svg>
  ),
  Briefcase: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2.5" y="7" width="19" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
};

const nav = [
  { label: "Dashboard", icon: Icon.Grid, active: true },
  { label: "Transactions", icon: Icon.List },
  { label: "Budgets", icon: Icon.Pie },
  { label: "Goals", icon: Icon.Target },
  { label: "Insights", icon: Icon.Chart },
  { label: "Settings", icon: Icon.Gear },
];

const spendingCategories = [
  { label: "Groceries", amount: 420, color: "#2ee6a6" },
  { label: "Dining Out", amount: 300, color: "#4d8bf5" },
  { label: "Transport", amount: 240, color: "#f5a623" },
  { label: "Entertainment", amount: 240, color: "#f5556c" },
];

const monthlyFlow = [
  { month: "Mar", income: 60, expenses: 40 },
  { month: "Apr", income: 65, expenses: 42 },
  { month: "May", income: 78, expenses: 55 },
  { month: "Jun", income: 85, expenses: 48 },
  { month: "Jul", income: 92, expenses: 38 },
];

const recentActivity = [
  { name: "Netflix Subscription", meta: "Entertainment • Today", amount: -15.49, icon: Icon.Card },
  { name: "Trader Joe's", meta: "Groceries • Yesterday", amount: -84.2, icon: Icon.Cart },
  { name: "Employer Payroll", meta: "Income • Jul 15", amount: 2450.0, icon: Icon.Briefcase },
];

const upcomingBills = [
  { name: "Adobe Creative Cloud", meta: "In 3 days", amount: 54.99, icon: Icon.Card },
  { name: "Gym Membership", meta: "In 5 days", amount: 30.0, icon: Icon.Chart },
];

function currency(n: number) {
  const sign = n < 0 ? "-" : n > 0 ? "+" : "";
  return `${sign}$${Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function DonutChart({ data }: { data: typeof spendingCategories }) {
  const total = data.reduce((s, d) => s + d.amount, 0);
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  let offsetAcc = 0;

  return (
    <svg viewBox="0 0 120 120" className="donut">
      {data.map((d) => {
        const fraction = d.amount / total;
        const dash = fraction * circumference;
        const el = (
          <circle
            key={d.label}
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={d.color}
            strokeWidth="14"
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={-offsetAcc}
            transform="rotate(-90 60 60)"
          />
        );
        offsetAcc += dash;
        return el;
      })}
    </svg>
  );
}

function FlowChart({ data }: { data: typeof monthlyFlow }) {
  const max = Math.max(...data.flatMap((d) => [d.income, d.expenses]));
  return (
    <div className="flow-chart">
      {data.map((d) => (
        <div className="flow-col" key={d.month}>
          <div className="flow-bars">
            <div className="flow-bar income" style={{ height: `${(d.income / max) * 100}%` }} />
            <div className="flow-bar expenses" style={{ height: `${(d.expenses / max) * 100}%` }} />
          </div>
          <span className="flow-label">{d.month}</span>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="cc-shell">
      <aside className="cc-sidebar">
        <div className="cc-logo">
          <span className="cc-logo-mark">
            <Icon.Gear />
          </span>
          Cash Craft
        </div>

        <nav className="cc-nav">
          {nav.map((item) => (
            <button key={item.label} className={`cc-nav-item ${item.active ? "active" : ""}`}>
              <item.icon />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="cc-user">
          <div className="cc-avatar" />
          <div>
            <div className="cc-user-name">Alex Mercer</div>
            <div className="cc-user-plan">PRO Creator Plan</div>
          </div>
        </div>
      </aside>

      <main className="cc-main">
        <header className="cc-header">
          <div>
            <h1>Good morning, Alex</h1>
            <p>Here's a breakdown of your personal economy today.</p>
          </div>
          <button className="cc-btn-primary">Link Bank Account</button>
        </header>

        <section className="cc-top-row">
          <div className="cc-card cc-networth">
            <span className="cc-eyebrow">Net Worth</span>
            <div className="cc-networth-value">$142,405.12</div>
            <span className="cc-subtext">+4.8% from last month</span>
          </div>

          <div className="cc-card cc-stat">
            <span className="cc-stat-label">Savings Rate</span>
            <div className="cc-stat-value">
              32.4% <span className="cc-stat-delta up">+2.1%</span>
            </div>
          </div>

          <div className="cc-card cc-stat">
            <span className="cc-stat-label">Active Subs</span>
            <div className="cc-stat-value">
              $84.90<span className="cc-stat-unit">/mo</span> <span className="cc-stat-delta muted">12 active</span>
            </div>
          </div>

          <div className="cc-card cc-stat">
            <span className="cc-stat-label">Budget Left</span>
            <div className="cc-stat-value">
              $420.15 <span className="cc-stat-delta muted">8 days left</span>
            </div>
          </div>
        </section>

        <section className="cc-mid-row">
          <div className="cc-card">
            <h2>Monthly Spending Summary</h2>
            <div className="cc-spending-body">
              <DonutChart data={spendingCategories} />
              <ul className="cc-legend">
                {spendingCategories.map((c) => (
                  <li key={c.label}>
                    <span className="cc-dot" style={{ background: c.color }} />
                    <span className="cc-legend-label">{c.label}</span>
                    <span className="cc-legend-amount">${c.amount.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="cc-card">
            <div className="cc-flow-header">
              <h2>Income vs Expenses</h2>
              <div className="cc-flow-key">
                <span>
                  <i className="cc-dot income" /> Income
                </span>
                <span>
                  <i className="cc-dot expenses" /> Expenses
                </span>
              </div>
            </div>
            <FlowChart data={monthlyFlow} />
          </div>
        </section>

        <section className="cc-bottom-row">
          <div className="cc-card">
            <h2>Recent Activity</h2>
            <ul className="cc-activity-list">
              {recentActivity.map((a) => (
                <li key={a.name}>
                  <span className="cc-activity-icon">
                    <a.icon />
                  </span>
                  <div className="cc-activity-text">
                    <div className="cc-activity-name">{a.name}</div>
                    <div className="cc-activity-meta">{a.meta}</div>
                  </div>
                  <span className={`cc-activity-amount ${a.amount > 0 ? "positive" : ""}`}>
                    {currency(a.amount)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="cc-card">
            <h2>Upcoming Bills</h2>
            <ul className="cc-activity-list">
              {upcomingBills.map((b) => (
                <li key={b.name}>
                  <span className="cc-activity-icon">
                    <b.icon />
                  </span>
                  <div className="cc-activity-text">
                    <div className="cc-activity-name">{b.name}</div>
                    <div className="cc-activity-meta">{b.meta}</div>
                  </div>
                  <span className="cc-activity-amount">${b.amount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}

import "./Dashboard.css";
import { useAuth } from "../Context/AuthContext";
import { useEffect, useState } from "react";
import { getAccountsByUserId } from "../api/accountsApi";
import { getTransactionsByUserId } from "../api/transactionsApi";
import type { Account } from "../types/account";
import type { Transaction } from "../types/transactions";
import { classifyTransaction } from "../utils/transactonUtils";
import PlaidLinkButton from "./PlaidLinkButton";
 
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


type SpendingCategory = {
    label: string;
    amount: number;
    color: string;
};

function DonutChart({ data }: { data: SpendingCategory[] }) {
  const total = data.reduce((s, d) => s + d.amount, 0);
  if (total === 0){
    return <p>No spending this month</p>
  }
  const radius = 46;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg viewBox="0 0 120 120" className="donut">
      {data.map((d, index) => {
        const fraction = d.amount / total;
        const dash = fraction * circumference;
        const previousAmount = data
              .slice(0, index)
              .reduce((sum, item) => sum + item.amount, 0);
        const offset = (previousAmount / total) * circumference;
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
            strokeDashoffset={-offset}
            transform="rotate(-90 60 60)"
          />
        );
        return el;
      })}
    </svg>
  );
}

type MonthlyFlow = {
    month: string;
    income: number;
    expenses: number;
};

function FlowChart({ data }: { data: MonthlyFlow[] }) {
  const max = Math.max(
    1,
    ...data.flatMap((d) => [d.income, d.expenses])
  );

  return (
    <div className="flow-chart">
      {data.map((d) => (
        <div className="flow-col" key={d.month}>
          <div className="flow-bars">
            <div
              className="flow-bar income"
              style={{ height: `${(d.income / max) * 100}%` }}
            />
            <div
              className="flow-bar expenses"
              style={{ height: `${(d.expenses / max) * 100}%` }}
            />
          </div>
          <span className="flow-label">{d.month}</span>
        </div>
      ))}
    </div>
  );
}


export default function Dashboard() {
  const { user } = useAuth();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if(!user) return;

    let cancelled = false;

    async function loadDashboardData() {
      setLoading(true);
      setError("");

      try {
        const [accountsData, transactionsData] = await Promise.all([
          getAccountsByUserId(user!.id),
          getTransactionsByUserId(user!.id)
        ]);
        console.log("transactions", transactionsData)

        if(!cancelled) {
          setAccounts(accountsData);
          setTransactions(transactionsData);
        }
      } catch (err) {
        console.error(err);

        if(!cancelled) {
          setError("Failed to load dashboard data.");
        }
      } finally {
        if(!cancelled) {
          setLoading(false);
        }
      }
    }

    

    loadDashboardData();
    
    return () => {
      cancelled = true;
    };
  }, [user?.id, refreshKey]);

  function handlePlaidLinked() {
      setRefreshKey(prev => prev + 1);
    }

  const classifiedTransactions = transactions.map(classifyTransaction);

  const now = new Date();
  const monthlyTransactions = classifiedTransactions.filter((t) => {
    const date = new Date(t.date);

    return (
        date.getUTCMonth() === now.getMonth() &&
        date.getUTCFullYear() === now.getFullYear() &&
        t.kind === "expense"
    );
});

  const categoryTotals = monthlyTransactions.reduce<Record<string, number>>(
    (totals, t) => {
        totals[t.displayCategory] =
            (totals[t.displayCategory] || 0) + t.amount;

        return totals;
    },
    {}
);

  const colors = [
    "#2ee6a6",
    "#4d8bf5",
    "#f5a623",
    "#f5556c",
    "#a78bfa",
    "#22d3ee",
  ];

  const spendingCategories = Object.entries(categoryTotals).map(
    ([label, amount], index) => ({
        label,
        amount,
        color: colors[index % colors.length],
    })
);

  const monthlyFlow: MonthlyFlow[] = Array.from(
    { length: 5 },
    (_, index) => {
        const monthDate = new Date(
            now.getFullYear(),
            now.getMonth() - (4 - index),
            1
        );

        const monthTransactions = classifiedTransactions.filter((t) => {
    const date = new Date(t.date);

    return (
        date.getUTCMonth() === monthDate.getMonth() &&
        date.getUTCFullYear() === monthDate.getFullYear()
    );
});

  const expenses = monthTransactions
    .filter(t => t.kind === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const income = monthTransactions
    .filter(t => t.kind === "income")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return {
    month: monthDate.toLocaleString("en-US", {
        month: "short"
    }),
    income,
    expenses
  };
      }
    );

  const recentTransactions = [...classifiedTransactions]
    .sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    .slice(0, 5);

  const totalAssets = accounts
      .filter(a => a.type === "depository" || a.type === "investment")
      .reduce((sum, a) => sum + a.currentBalance, 0);

  const totalLiablitliies = accounts
          .filter(a => a.type === "credit" || a.type === "loan")
          .reduce((sum, a) => sum + a.currentBalance, 0);

  const netWorth = totalAssets - totalLiablitliies;



  return (


      <main className="cc-main">
        <header className="cc-header">
          <div>
            <h1>Good morning, {user?.name ?? "Guest"}</h1>
            <p>Here's a breakdown of your personal economy today.</p>
          </div>
          <PlaidLinkButton onLinked={handlePlaidLinked}/>
        </header>

        <section className="cc-top-row">
          <div className="cc-card cc-networth">
            <span className="cc-eyebrow">Net Worth</span>
            <div className="cc-networth-value">
              {loading ? "Loading..." : error ? "Unavailable" : netWorth.toLocaleString("en-US", {
                style: "currency",
                currency: "USD"
              })}
            </div>
            <span className="cc-subtext">Based on {accounts.length} linked accounts</span>
          </div>

          <div className="cc-card cc-stat">
            <span className="cc-stat-label">Total Assets</span>
            <div className="cc-stat-value">
              {loading ? "Loading..." : error ? "Unavailable" : totalAssets.toLocaleString("en-US", {
                style: "currency",
                currency: "USD"
              })}
            </div>
          </div>

          <div className="cc-card cc-stat">
            <span className="cc-stat-label">Total Debt</span>
            <div className="cc-stat-value">
              {loading ? "Loading..." : error ? "Unavailable" : totalLiablitliies.toLocaleString("en-US", {
                style: "currency",
                currency: "USD"
              })}
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
    <h2>Recent Transactions</h2>

    {loading ? (
        <p>Loading transactions...</p>
    ) : error ? (
        <p>{error}</p>
    ) : recentTransactions.length === 0 ? (
        <p>No recent transactions found.</p>
    ) : (
        <ul className="cc-activity-list">
            {recentTransactions.map((t) => (
                <li key={t.id}>
                    <span className="cc-activity-icon">
                        <Icon.Card />
                    </span>

                    <div className="cc-activity-text">
                        <div className="cc-activity-name">
                            {t.name}
                        </div>

                        <div className="cc-activity-meta">
                          {t.displayCategory} • {new Date(t.date).toLocaleDateString("en-US", {
                            timeZone: "UTC",
                            month: "short",
                            day: "numeric"
              })}
              </div>
                    </div>

                    <span className={`cc-activity-amount ${t.amount < 0 ? "positive" : ""}`}>
                        {(-t.amount).toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                            signDisplay: "always"
                        })}
                    </span>
                </li>
            ))}
        </ul>
    )}
</div>

          
        </section>
      </main>
  );
}

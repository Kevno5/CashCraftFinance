import { useEffect, useState } from "react";
import "./Dashboard.css";
import "./Pages.css";
import { useAuth } from "../Context/AuthContext";
import { getTransactionsByUserId } from "../api/transactionsApi";
import { classifyTransaction } from "../utils/transactonUtils";

// Set to true to preview this page with fake data on your own machine.
// Keep it false when you commit.
const USE_SAMPLE_DATA = false;

type Row = {
  id: string | number;
  name: string;
  date: string;
  amount: number; // expenses are positive, income is negative
  kind: string;
  displayCategory: string;
};

function daysAgo(n: number) {
  return new Date(Date.now() - n * 86_400_000).toISOString();
}

const sampleRows: Row[] = [
  { id: 1, name: "Whole Foods", date: daysAgo(2), amount: 84.2, kind: "expense", displayCategory: "Groceries" },
  { id: 2, name: "Uber", date: daysAgo(3), amount: 23.5, kind: "expense", displayCategory: "Transport" },
  { id: 3, name: "Netflix", date: daysAgo(5), amount: 15.49, kind: "expense", displayCategory: "Entertainment" },
  { id: 4, name: "Whole Foods", date: daysAgo(6), amount: 61.0, kind: "expense", displayCategory: "Groceries" },
  { id: 5, name: "Paycheck", date: daysAgo(7), amount: -2400, kind: "income", displayCategory: "Income" },
  { id: 6, name: "Rent", date: daysAgo(40), amount: 900, kind: "expense", displayCategory: "Housing" },
  { id: 7, name: "Whole Foods", date: daysAgo(45), amount: 120, kind: "expense", displayCategory: "Groceries" },
  { id: 8, name: "Paycheck", date: daysAgo(38), amount: -2400, kind: "income", displayCategory: "Income" },
  { id: 9, name: "Rent", date: daysAgo(70), amount: 900, kind: "expense", displayCategory: "Housing" },
  { id: 10, name: "Uber", date: daysAgo(75), amount: 48, kind: "expense", displayCategory: "Transport" },
];

function money(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

// A month as one number, so months can be compared and subtracted.
function monthKey(d: Date) {
  return d.getUTCFullYear() * 12 + d.getUTCMonth();
}

function monthLabel(key: number) {
  const date = new Date(Date.UTC(Math.floor(key / 12), key % 12, 1));
  return date.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
}

function BarRow({ label, amount, percent }: { label: string; amount: number; percent: number }) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span>{label}</span>
        <span>{money(amount)}</span>
      </div>
      <div className="cc-progress">
        <div className="cc-progress-fill" style={{ width: `${Math.max(2, Math.min(100, percent))}%` }} />
      </div>
    </div>
  );
}

export default function Insights() {
  const { user } = useAuth();

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (USE_SAMPLE_DATA) {
      setRows(sampleRows);
      setLoading(false);
      return;
    }

    if (!user) {
      setLoading(false);
      return;
    }

    const userId = user.id;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const data = await getTransactionsByUserId(userId);
        const mapped: Row[] = data.map(classifyTransaction).map((t) => ({
          id: t.id,
          name: t.name,
          date: t.date,
          amount: t.amount,
          kind: t.kind,
          displayCategory: t.displayCategory,
        }));
        if (!cancelled) setRows(mapped);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Failed to load insights.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const nowKey = monthKey(new Date());

  const thisMonth = rows.filter((t) => monthKey(new Date(t.date)) === nowKey);
  const expenses = thisMonth.filter((t) => t.kind === "expense");

  const spent = expenses.reduce((sum, t) => sum + t.amount, 0);
  const earned = thisMonth
    .filter((t) => t.kind === "income")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const savingsRate = earned > 0 ? Math.round(((earned - spent) / earned) * 100) : null;

  // Spending by category (this month), biggest first
  const categoryTotals: Record<string, number> = {};
  expenses.forEach((t) => {
    categoryTotals[t.displayCategory] = (categoryTotals[t.displayCategory] || 0) + t.amount;
  });
  const categories = Object.entries(categoryTotals)
    .map(([label, amount]) => ({ label, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 6);

  // Top merchants (this month)
  const merchantTotals: Record<string, number> = {};
  expenses.forEach((t) => {
    merchantTotals[t.name] = (merchantTotals[t.name] || 0) + t.amount;
  });
  const merchants = Object.entries(merchantTotals)
    .map(([label, amount]) => ({ label, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  // Spending for each of the last 6 months
  const trend = Array.from({ length: 6 }, (_, i) => {
    const key = nowKey - (5 - i);
    const amount = rows
      .filter((t) => t.kind === "expense" && monthKey(new Date(t.date)) === key)
      .reduce((sum, t) => sum + t.amount, 0);
    return { label: monthLabel(key), amount };
  });
  const trendMax = Math.max(1, ...trend.map((m) => m.amount));

  const hasData = rows.length > 0;
  const show = (value: string) => (loading ? "Loading..." : error ? "Unavailable" : value);

  return (
    <main className="cc-main">
      <header className="cc-header">
        <div>
          <h1>Insights</h1>
          <p>Where your money goes, and how it's changing.</p>
        </div>
      </header>

      <section className="cc-page-stats">
        <div className="cc-card cc-networth">
          <span className="cc-eyebrow">Savings Rate</span>
          <div className="cc-networth-value">
            {show(savingsRate === null ? "N/A" : `${savingsRate}%`)}
          </div>
          <span className="cc-subtext">of this month's income kept</span>
        </div>
        <div className="cc-card cc-stat">
          <span className="cc-stat-label">Spent This Month</span>
          <div className="cc-stat-value">{show(money(spent))}</div>
        </div>
        <div className="cc-card cc-stat">
          <span className="cc-stat-label">Top Category</span>
          <div className="cc-stat-value">{show(categories[0]?.label ?? "N/A")}</div>
        </div>
      </section>

      {!loading && !error && !hasData ? (
        <div className="cc-card cc-empty">
          No data to analyze yet. Link a bank account to see your insights here.
        </div>
      ) : (
        <>
          <section className="cc-mid-row">
            <div className="cc-card">
              <h2>Spending by Category</h2>
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p>{error}</p>
              ) : categories.length === 0 ? (
                <p>No spending this month.</p>
              ) : (
                categories.map((c) => (
                  <BarRow key={c.label} label={c.label} amount={c.amount} percent={(c.amount / spent) * 100} />
                ))
              )}
            </div>

            <div className="cc-card">
              <h2>Top Merchants</h2>
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p>{error}</p>
              ) : merchants.length === 0 ? (
                <p>No spending this month.</p>
              ) : (
                merchants.map((m) => (
                  <BarRow key={m.label} label={m.label} amount={m.amount} percent={(m.amount / merchants[0].amount) * 100} />
                ))
              )}
            </div>
          </section>

          <div className="cc-card">
            <h2>Spending Trend (Last 6 Months)</h2>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              trend.map((m) => (
                <BarRow key={m.label} label={m.label} amount={m.amount} percent={(m.amount / trendMax) * 100} />
              ))
            )}
          </div>
        </>
      )}
    </main>
  );
}
import { useEffect, useState } from "react";
import "./Dashboard.css";
import "./Pages.css";
import { useAuth } from "../Context/AuthContext";
import { getTransactionsByUserId } from "../api/transactionsApi";
import type { Transaction } from "../types/transactions";
import { classifyTransaction } from "../utils/transactonUtils";

type Filter = "all" | "income" | "expense";

function money(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function Transactions() {
  const { user } = useAuth();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
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
        if (!cancelled) setTransactions(data);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Failed to load transactions.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const classified = transactions
    .map(classifyTransaction)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const visible = classified.filter((t) => {
    const matchesFilter = filter === "all" || t.kind === filter;
    const text = search.trim().toLowerCase();
    const matchesSearch =
      !text ||
      t.name.toLowerCase().includes(text) ||
      t.displayCategory.toLowerCase().includes(text);
    return matchesFilter && matchesSearch;
  });

  const totalIncome = classified
    .filter((t) => t.kind === "income")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalExpenses = classified
    .filter((t) => t.kind === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <main className="cc-main">
      <header className="cc-header">
        <div>
          <h1>Transactions</h1>
          <p>Everything coming in and going out.</p>
        </div>
      </header>

      <section className="cc-page-stats">
        <div className="cc-card cc-networth">
          <span className="cc-eyebrow">Total Transactions</span>
          <div className="cc-networth-value">
            {loading ? "Loading..." : error ? "Unavailable" : classified.length}
          </div>
          <span className="cc-subtext">across all linked accounts</span>
        </div>
        <div className="cc-card cc-stat">
          <span className="cc-stat-label">Income</span>
          <div className="cc-stat-value">
            {loading ? "Loading..." : error ? "Unavailable" : money(totalIncome)}
          </div>
        </div>
        <div className="cc-card cc-stat">
          <span className="cc-stat-label">Expenses</span>
          <div className="cc-stat-value">
            {loading ? "Loading..." : error ? "Unavailable" : money(totalExpenses)}
          </div>
        </div>
      </section>

      <div className="cc-card cc-form">
        <div className="cc-form-grid">
          <label>
            Search
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name or category"
            />
          </label>
          <label>
            Show
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as Filter)}
            >
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expenses</option>
            </select>
          </label>
        </div>
      </div>

      <div className="cc-card">
        <h2>All Transactions</h2>

        {loading ? (
          <p>Loading transactions...</p>
        ) : error ? (
          <p>{error}</p>
        ) : visible.length === 0 ? (
          <p>
            {classified.length === 0
              ? "No transactions yet. Link a bank account to see them here."
              : "No transactions match your search."}
          </p>
        ) : (
          <ul className="cc-activity-list">
            {visible.map((t) => (
              <li key={t.id}>
                <div className="cc-activity-text">
                  <div className="cc-activity-name">{t.name}</div>
                  <div className="cc-activity-meta">
                    {t.displayCategory} •{" "}
                    {new Date(t.date).toLocaleDateString("en-US", {
                      timeZone: "UTC",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>

                <span
                  className={`cc-activity-amount ${t.amount < 0 ? "positive" : ""}`}
                >
                  {(-t.amount).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    signDisplay: "always",
                  })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
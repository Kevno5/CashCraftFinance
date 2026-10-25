import { useState } from "react";
import "./Dashboard.css";
import "./Pages.css";

// Matches the shape we're asking the backend to return from /api/Goals
export type Goal = {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string | null; // ISO date, e.g. "2027-06-01"
};

// TODO: replace with GET /api/Goals/user/{userId} once the backend has a Goals API
const sampleGoals: Goal[] = [
  { id: 1, name: "Emergency Fund", targetAmount: 5000, currentAmount: 3250, targetDate: "2027-03-01" },
  { id: 2, name: "New Laptop", targetAmount: 1500, currentAmount: 600, targetDate: "2026-12-20" },
  { id: 3, name: "Spring Break Trip", targetAmount: 1200, currentAmount: 1200, targetDate: "2027-03-10" },
];

function money(n: number) {
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function daysLeft(date: string | null) {
  if (!date) return "No deadline";
  const days = Math.ceil((new Date(date).getTime() - Date.now()) / 86_400_000);
  if (days < 0) return "Past deadline";
  if (days === 0) return "Due today";
  return `${days} days left`;
}

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>(sampleGoals);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [saved, setSaved] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  const totalSaved = goals.reduce((s, g) => s + g.currentAmount, 0);
  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);
  const completed = goals.filter((g) => g.currentAmount >= g.targetAmount).length;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const targetAmount = Number(target);
    const currentAmount = saved ? Number(saved) : 0;

    if (!name.trim()) return setError("Please give your goal a name.");
    if (!(targetAmount > 0)) return setError("Target amount must be more than $0.");
    if (currentAmount < 0) return setError("Amount saved can't be negative.");

    // TODO: POST /api/Goals/user/{userId} once the backend has a Goals API
    setGoals([
      ...goals,
      { id: Date.now(), name: name.trim(), targetAmount, currentAmount, targetDate: date || null },
    ]);
    setName("");
    setTarget("");
    setSaved("");
    setDate("");
    setShowForm(false);
  };

  // TODO: DELETE /api/Goals/{id} once the backend has a Goals API
  const handleDelete = (id: number) => setGoals(goals.filter((g) => g.id !== id));

  return (
    

      <main className="cc-main">
        <header className="cc-header">
          <div>
            <h1>Savings Goals</h1>
            <p>Track what you're saving for and how close you are.</p>
          </div>
          <button className="cc-btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "+ New Goal"}
          </button>
        </header>

        <section className="cc-page-stats">
          <div className="cc-card cc-networth">
            <span className="cc-eyebrow">Total Saved</span>
            <div className="cc-networth-value">{money(totalSaved)}</div>
            <span className="cc-subtext">of {money(totalTarget)} across all goals</span>
          </div>
          <div className="cc-card cc-stat">
            <span className="cc-stat-label">Active Goals</span>
            <div className="cc-stat-value">{goals.length - completed}</div>
          </div>
          <div className="cc-card cc-stat">
            <span className="cc-stat-label">Completed</span>
            <div className="cc-stat-value">
              {completed} <span className="cc-stat-delta up">🎉</span>
            </div>
          </div>
        </section>

        {showForm && (
          <form className="cc-card cc-form" onSubmit={handleAdd}>
            <h2>New Goal</h2>
            <div className="cc-form-grid">
              <label>
                Goal name
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Emergency Fund" />
              </label>
              <label>
                Target amount ($)
                <input type="number" min="0" step="0.01" value={target} onChange={(e) => setTarget(e.target.value)} />
              </label>
              <label>
                Already saved ($)
                <input type="number" min="0" step="0.01" value={saved} onChange={(e) => setSaved(e.target.value)} />
              </label>
              <label>
                Target date (optional)
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </label>
            </div>
            {error && <p className="cc-form-error">{error}</p>}
            <button type="submit" className="cc-btn-primary">Add Goal</button>
          </form>
        )}

        {goals.length === 0 ? (
          <div className="cc-card cc-empty">No goals yet. Click "+ New Goal" to add your first one.</div>
        ) : (
          <section className="cc-goal-grid">
            {goals.map((g) => {
              const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
              const done = g.currentAmount >= g.targetAmount;
              return (
                <div className="cc-card cc-goal" key={g.id}>
                  <div className="cc-goal-top">
                    <h2>{g.name}</h2>
                    <button className="cc-btn-ghost" onClick={() => handleDelete(g.id)} aria-label={`Delete ${g.name}`}>
                      ✕
                    </button>
                  </div>
                  <div className="cc-goal-amounts">
                    <span className="cc-goal-current">{money(g.currentAmount)}</span>
                    <span className="cc-subtext"> / {money(g.targetAmount)}</span>
                  </div>
                  <div className="cc-progress">
                    <div className={`cc-progress-fill ${done ? "done" : ""}`} style={{ width: `${pct}%` }} />
                  </div>
                  <div className="cc-goal-footer">
                    <span>{done ? "Goal reached!" : `${pct}% saved`}</span>
                    <span>{done ? "" : daysLeft(g.targetDate)}</span>
                  </div>
                </div>
              );
            })}
          </section>
        )}
      </main>
  );
}

import "./Dashboard.css";

// Shared sidebar for the new pages. Dashboard.tsx still has its own copy;
// switch it over to this component when routing is added.

export type Page = "Dashboard" | "Transactions" | "Budgets" | "Goals" | "Insights" | "Settings";

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
};

const nav: { label: Page; icon: () => React.JSX.Element }[] = [
  { label: "Dashboard", icon: Icon.Grid },
  { label: "Transactions", icon: Icon.List },
  { label: "Budgets", icon: Icon.Pie },
  { label: "Goals", icon: Icon.Target },
  { label: "Insights", icon: Icon.Chart },
  { label: "Settings", icon: Icon.Gear },
];

type SidebarProps = {
  active: Page;
  onNavigate?: (page: Page) => void;
};

export default function Sidebar({ active, onNavigate }: SidebarProps) {
  return (
    <aside className="cc-sidebar">
      <div className="cc-logo">
        <span className="cc-logo-mark">
          <Icon.Gear />
        </span>
        Cash Craft
      </div>

      <nav className="cc-nav">
        {nav.map((item) => (
          <button
            key={item.label}
            className={`cc-nav-item ${item.label === active ? "active" : ""}`}
            onClick={() => onNavigate?.(item.label)}
          >
            <item.icon />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="cc-user">
        <div className="cc-avatar" />
        <div>
          {/* TODO: show the logged-in user once login is merged */}
          <div className="cc-user-name">Alex Mercer</div>
          <div className="cc-user-plan">PRO Creator Plan</div>
        </div>
      </div>
    </aside>
  );
}

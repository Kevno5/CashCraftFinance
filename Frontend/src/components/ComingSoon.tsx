import { Link } from "react-router-dom";
import "./Dashboard.css";
import "./Pages.css";

type Props = {
  title: string;
  message: string;
};

export default function ComingSoon({ title, message }: Props) {
  return (
    <main className="cc-main">
      <header className="cc-header">
        <div>
          <h1>{title}</h1>
          <p>{message}</p>
        </div>
      </header>

      <div className="cc-card cc-empty">
        <Link to="/dashboard">Back to Dashboard</Link>
      </div>
    </main>
  );
}
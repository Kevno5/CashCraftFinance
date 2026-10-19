
import { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    setSuccess("");

    if (!email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5049/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        localStorage.setItem("cashCraftUserId", String(data.userId));
        localStorage.setItem("cashCraftUserName", data.name || "");
        localStorage.setItem("cashCraftUserEmail", data.email || email.trim());

        setSuccess("Login successful! Opening your dashboard...");

        setTimeout(() => {
          navigate("/");
        }, 800);
      } else {
        setError(
          data.message || "Login failed. Please check your email and password."
        );
      }
    } catch {
      setError(
        "Unable to connect to the server. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-logo-space"></div>

        <h1>Cash Craft</h1>

        <p className="login-subtitle">
          Log in to manage your personal economy
        </p>

        <div className="login-form">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLogin();
            }}
          />

          {error && <p className="login-error">{error}</p>}
          {success && <p className="login-success">{success}</p>}

          <button onClick={handleLogin} disabled={loading}>
            {loading ? "Logging In..." : "Log In"}
          </button>

          <Link to="/register" className="login-register-link">
            Don't have an account? Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
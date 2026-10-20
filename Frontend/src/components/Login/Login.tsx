
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
// import "../Register/Register.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://localhost:7253/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: email.trim(),
            password
          })
        }
      );

      if (!response.ok) {
        setError(
          response.status === 401
            ? "Incorrect email or password."
            : "Login failed. Please try again."
        );
        return;
      }

      const data = await response.json();

      const loggedInUser = {
        id: data.userId,
        name: data.name,
        email: data.email
      };

      setUser(loggedInUser);

      sessionStorage.setItem("user", JSON.stringify(loggedInUser));
      sessionStorage.setItem("token", data.token);

      navigate("/dashboard");

    } catch (err) {
      console.error("Login request failed:", err);
      setError("Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">

        <div className="register-logo-space"></div>

        <h1>Cash Craft</h1>

        <p className="register-subtitle">
          Log in to manage your personal economy
        </p>

        <form className="register-form" onSubmit={handleLogin}>
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
          />

          {error && <p className="register-error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>

          <p>
            Don't have an account?{" "}
            <a href="/register">Register</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;

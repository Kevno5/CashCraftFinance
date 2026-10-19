import { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async () => {
    setError("");
    setSuccess("");

    if (!username.trim() || !email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (
      password.length < 8 ||
      !/[a-zA-Z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      setError(
        "Password must be at least 8 characters and contain at least one letter and one number."
      );
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5049/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: username.trim(),
            email: email.trim(),
            password: password,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (response.status === 201) {
        setSuccess(data.message || "Registration successful.");
        setUsername("");
        setEmail("");
        setPassword("");
      } else {
        const validationMessages = data.errors
          ? Object.values(
              data.errors as Record<string, string[]>
            ).flat()
          : [];

        setError(
          data.message ||
            validationMessages[0] ||
            "Registration failed. Please try again."
        );
      }
    } catch {
      setError(
        "Unable to connect to the server. Make sure the backend is running."
      );
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        {/* Empty space reserved for logo */}
        <div className="register-logo-space"></div>

        <h1>Cash Craft</h1>

        <p className="register-subtitle">
          Log in to manage your personal economy
        </p>

        <div className="register-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

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

          {error && (
            <p className="register-error">{error}</p>
          )}

          {success && (
            <p className="register-success">{success}</p>
          )}

          <button onClick={handleRegister}>
            Create Account
          </button>

          <Link
            to="/login"
            className="register-login-link"
          >
            Already have an account? Log in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
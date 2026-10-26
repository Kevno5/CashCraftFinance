import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import axiosClient from "../api/axiosClient";
import "./Register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError("");

    if (!username.trim() || !email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      await axiosClient.post("/api/auth/register", {
        name: username.trim(),
        email: email.trim(),
        password,
      });

      // Registration successful!
      navigate("/login");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 409) {
          setError("An account with this email already exists.");
        } else if (err.response.status === 400) {
          setError(
            "Invalid details. Password needs at least 8 characters, including a letter and a number."
          );
        } else {
          setError("Registration failed. Please try again.");
        }
      } else {
        console.error("Registration request failed:", err);
        setError("Unable to connect to the backend.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">

        {/* Empty space reserved for logo */}
        <div className="register-logo-space"></div>

        <h1>Cash Craft</h1>

        <p className="register-subtitle">
          Create your account to manage your personal economy
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

          {error && <p className="register-error">{error}</p>}

          <button onClick={handleRegister} disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <p>
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Register;
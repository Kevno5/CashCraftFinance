import {useState} from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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

  try {
    const response = await fetch(
      "https://localhost:7253/api/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: username.trim(),
          email: email.trim(),
          password
        })
      }
    );

    if (!response.ok) {
      if (response.status === 409) {
        setError("An account with this email already exists.");
      } else {
        setError("Registration failed. Please try again.");
      }
      return;
    }

    // Registration successful!
    navigate("/login");

  } catch (err) {
    console.error("Registration request failed:", err);
    setError("Unable to connect to the backend.");
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

          {error && <p className="register-error">{error}</p>}

          <button onClick={handleRegister}>Create Account</button>
        </div>

      </div>
    </div>
  );
}

export default Register;
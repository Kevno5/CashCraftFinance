import {useState} from "react";
import "./Register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = () => {
    setError("");

    if (!username || !email || !password) {
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

    console.log("Username:", username);
    console.log("Email:", email);
    console.log("Password:", password);
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
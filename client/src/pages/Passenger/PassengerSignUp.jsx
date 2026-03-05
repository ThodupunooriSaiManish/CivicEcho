import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function PassengerSignUp() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const handleSignup = async () => {

    if (!passwordsMatch) {
      alert("Passwords do not match");
      return;
    }

    const res = await fetch("http://localhost:5000/api/passenger/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password,
        mobile,
        email
      })
    });

    const data = await res.json();

    alert(data.message);

    if (res.ok) {
      navigate("/passenger-signin");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-overlay">
        <div className="auth-card">

          <h2>Create Passenger Account</h2>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {/* Password */}
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="toggle-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁"}
            </span>
          </div>

          {/* Confirm Password */}
          <div className="password-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span
              className="toggle-icon"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "🙈" : "👁"}
            </span>
          </div>

          {/* Match Message */}
          {confirmPassword.length > 0 && (
            <p className={passwordsMatch ? "match-success" : "match-error"}>
              {passwordsMatch
                ? "Passwords are matching ✅"
                : "Passwords do not match ❌"}
            </p>
          )}

          <input
            type="text"
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />

          <input
            type="email"
            placeholder="Mail ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button className="auth-btn" onClick={handleSignup}>
            Sign Up
          </button>

          <p className="switch-text">
            Already have an account?{" "}
            <span onClick={() => navigate("/passenger-signin")}>
              Sign In
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}

export default PassengerSignUp;
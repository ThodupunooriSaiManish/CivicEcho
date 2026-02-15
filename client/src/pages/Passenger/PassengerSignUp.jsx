import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function PassengerSignUp() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  return (
    <div className="auth-container">
      <div className="auth-overlay">
        <div className="auth-card">

          <h2>Create Passenger Account</h2>

          <input type="text" placeholder="Username" />
          
          {/* Password Field */}
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

          {/* Confirm Password Field */}
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
            <p
              className={
                passwordsMatch ? "match-success" : "match-error"
              }
            >
              {passwordsMatch
                ? "Passwords are matching ✅"
                : "Passwords do not match ❌"}
            </p>
          )}

          <input type="text" placeholder="Mobile Number" />
          <input type="email" placeholder="Mail ID" />

          <button className="auth-btn">Sign Up</button>

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
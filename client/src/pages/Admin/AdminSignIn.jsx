import { useState } from "react";
import "./AdminAuth.css";

function AdminSignIn() {

  // Hardcoded admin details
  const ADMIN_USERNAME = "admin123";
  const ADMIN_PASSWORD = "Admin@123";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("login"); // login or otp

const handleLogin = async () => {

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {

    try {
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
          body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        setStep("otp");   // move to OTP screen
      } else {
        alert("Failed to send OTP");
      }

    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Server error");
    }

  } else {
    alert("Invalid Username or Password");
  }
};

const verifyOtp = async () => {
  const res = await fetch("http://localhost:5000/api/admin/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ otp }),
  });

  if (res.ok) {
    alert("Admin Login Successful ✅");
  } else {
    alert("Invalid OTP ❌");
  }
};

  return (
    <div className="auth-container">
      <div className="auth-overlay">
        <div className="auth-card">

          {step === "login" ? (
            <>
              <h2>Admin Sign In</h2>

              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button className="auth-btn" onClick={handleLogin}>
                Sign In
              </button>
            </>
          ) : (
            <>
              <h2>Enter OTP</h2>

              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <button className="auth-btn" onClick={verifyOtp}>
                Verify OTP
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default AdminSignIn;
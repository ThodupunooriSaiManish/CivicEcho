import { useState } from "react";
import "./AdminAuth.css";

function AdminSignIn() {

  // Hardcoded admin details
  const ADMIN_USERNAME = "admin123";
  const ADMIN_PASSWORD = "Admin@123";
  const ADMIN_MOBILE = "9398523057";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [step, setStep] = useState("login"); // login or otp

  const handleLogin = () => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {

      // Generate 6 digit OTP
      const newOtp = Math.floor(100000 + Math.random() * 900000);
      setGeneratedOtp(newOtp);

      console.log("OTP sent to mobile:", ADMIN_MOBILE);
      console.log("Generated OTP:", newOtp);

      setStep("otp");
    } else {
      alert("Invalid Username or Password");
    }
  };

  const verifyOtp = () => {
    if (parseInt(otp) === generatedOtp) {
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
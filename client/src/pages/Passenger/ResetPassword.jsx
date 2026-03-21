import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ResetPassword() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleReset = async () => {

    const res = await fetch("http://localhost:5000/api/passenger/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        otp,
        newPassword
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

          <h2>Reset Password</h2>

          <input
            type="email"
            placeholder="Enter Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="text"
            placeholder="Enter OTP"
            onChange={(e) => setOtp(e.target.value)}
          />

          <input
            type="password"
            placeholder="New Password"
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button className="auth-btn" onClick={handleReset}>
            Reset Password
          </button>

        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
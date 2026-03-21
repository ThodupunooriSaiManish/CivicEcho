import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {

  const [email, setEmail] = useState("");
  const navigate = useNavigate();  


  const handleSendOtp = async () => {
    const res = await fetch("http://localhost:5000/api/passenger/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });

    const data = await res.json();
    alert(data.message);
    navigate("/reset-password");
  };

  return (
    <div className="auth-container">
      <div className="auth-overlay">
        <div className="auth-card">

          <h2>Forgot Password</h2>

          <input
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <button className="auth-btn" onClick={handleSendOtp}>
            Send OTP
          </button>

        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
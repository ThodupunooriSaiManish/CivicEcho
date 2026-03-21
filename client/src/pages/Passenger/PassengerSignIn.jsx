import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function PassengerSignIn() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    const res = await fetch("http://localhost:5000/api/passenger/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    });

    const data = await res.json();

    if (res.ok) {

      localStorage.setItem("passenger", JSON.stringify(data.user));

      navigate("/passenger-dashboard");

    } else {
      alert(data.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-overlay">
        <div className="auth-card signin-card">

          <h2>Passenger Sign In</h2>

          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="auth-btn" onClick={handleLogin}>
            Sign In
          </button>

          <p
  className="forgot-password"
  onClick={() => navigate("/forgot-password")}
>
  Forgot Password?
</p>

        </div>
      </div>
    </div>
  );
}

export default PassengerSignIn;
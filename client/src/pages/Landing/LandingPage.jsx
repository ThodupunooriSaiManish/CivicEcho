import { useState } from "react";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";


function LandingPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState("passenger");


  return (
    <div className="landing-container">
      <div className="overlay">
        <div className="card">
          <h1 className="title">CivicEcho</h1>
          <p className="tagline">Your voice for better bus services</p>

          <div className="role-toggle">
            <button
              className={role === "passenger" ? "toggle active" : "toggle"}
              onClick={() => setRole("passenger")}
            >
              Passenger
            </button>
            <button
              className={role === "admin" ? "toggle active" : "toggle"}
              onClick={() => setRole("admin")}
            >
              Admin
            </button>
          </div>

          <div className="auth-section">
            {role === "admin" ? (
              <button className="btn primary">Admin Sign In</button>
            ) : (
              <>
            <button className="btn primary" onClick={() => navigate("/passenger-signin")}>
              Sign In
            </button>

            <button className="btn secondary" onClick={() => navigate("/passenger-signup")}>
             Sign Up
            </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default LandingPage;

import "./Auth.css";

function PassengerSignIn() {
  return (
    <div className="auth-container">
      <div className="auth-overlay">
        <div className="auth-card signin-card">

          <h2>Passenger Sign In</h2>

          <input type="text" placeholder="Username" />
          <input type="password" placeholder="Password" />

          <button className="auth-btn">Sign In</button>

          <p className="forgot-password">Forgot Password?</p>

        </div>
      </div>
    </div>
  );
}

export default PassengerSignIn;
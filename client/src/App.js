import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/Landing/LandingPage";
import PassengerSignUp from "./pages/Passenger/PassengerSignUp";
import PassengerSignIn from "./pages/Passenger/PassengerSignIn";
import AdminSignIn from "./pages/Admin/AdminSignIn";
import PassengerDashboard from "./pages/Passenger/PassengerDashboard";
import ForgotPassword from "./pages/Passenger/ForgotPassword";
import ResetPassword from "./pages/Passenger/ResetPassword";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/passenger-signup" element={<PassengerSignUp />} />
        <Route path="/passenger-signin" element={<PassengerSignIn />} />
        <Route path="/admin-signin" element={<AdminSignIn />} />
        <Route path="/passenger-dashboard" element={<PassengerDashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
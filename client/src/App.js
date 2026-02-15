import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/Landing/LandingPage";
import PassengerSignUp from "./pages/Passenger/PassengerSignUp";
import PassengerSignIn from "./pages/Passenger/PassengerSignIn";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/passenger-signup" element={<PassengerSignUp />} />
        <Route path="/passenger-signin" element={<PassengerSignIn />} />
      </Routes>
    </Router>
  );
}

export default App;
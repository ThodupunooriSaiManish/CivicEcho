import { useState } from "react";
import "./PassengerDashboard.css";
import { useEffect } from "react";

function PassengerDashboard() {

  const [activeTab, setActiveTab] = useState("submit");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [username, setUsername] = useState("");

useEffect(() => {
  const user = JSON.parse(localStorage.getItem("passenger"));
  if (user) {
    setUsername(user.username);
  }
}, []);

  return (
    <div className="dashboard">

      {/* Sidebar */}
      <div className="sidebar">
        <h2>CivicEcho</h2>

        <button
          className={activeTab === "submit" ? "active" : ""}
          onClick={() => setActiveTab("submit")}
        >
          Submit Complaint
        </button>

        <button
          className={activeTab === "complaints" ? "active" : ""}
          onClick={() => setActiveTab("complaints")}
        >
          My Complaints
        </button>

        <div className="user-info">
        <p>Welcome</p>
            <h4>{username}</h4>
        </div>

    <button
    className="logout"
    onClick={() => {
        localStorage.removeItem("passenger");
        window.location.href = "/";
    }}
    >
  Logout
</button>   
    </div>

      {/* Main Content */}
      <div className="main-content">

        {activeTab === "submit" && (
          <div className="panel">

            <h2>Submit Complaint</h2>

            <select>
              <option>Mode of Transport</option>
              <option>RTC Bus</option>
              <option>Metro</option>
              <option>MMTS</option>
            </select>

            <select>
              <option>Type of Data</option>
              <option>Text</option>
              <option>Photo</option>
              <option>Video</option>
            </select>

            <input type="file" />

            <textarea placeholder="Describe the issue..." />

            <button className="submit-btn">
              Submit Complaint
            </button>

          </div>
        )}

        {activeTab === "complaints" && (
          <div className="panel">

            <h2>My Complaints</h2>

            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Transport</th>
                  <th>Status</th>
                </tr>
              </thead>

                <tbody>
  <tr>
    <td colSpan="3" style={{ textAlign: "center", padding: "20px" }}>
      No complaints submitted yet
    </td>
  </tr>
</tbody>
            </table>

          </div>
        )}

      </div>


      {/* Complaint Details Panel */}
      {selectedComplaint && (
        <div className="details">

          <h3>Complaint Details</h3>

          <p><b>ID:</b> {selectedComplaint.id}</p>
          <p><b>Transport:</b> {selectedComplaint.transport}</p>
          <p><b>Description:</b> {selectedComplaint.description}</p>
          <p><b>Status:</b> {selectedComplaint.status}</p>

        </div>
      )}

    </div>
  );
}

export default PassengerDashboard;
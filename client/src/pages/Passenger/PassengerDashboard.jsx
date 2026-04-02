import { useState, useEffect } from "react";
import "./PassengerDashboard.css";

function PassengerDashboard() {

  const [activeTab, setActiveTab] = useState("submit");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [username, setUsername] = useState("");

  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");

  const [mode, setMode] = useState("");
  const [dataType, setDataType] = useState("");
  const [description, setDescription] = useState("");
  const [issue,setIssue]=useState("");

  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("passenger"));
    if (user) {
      setUsername(user.username);
    }
  }, []);

  useEffect(() => {
  if (activeTab === "complaints") {

    fetch(`http://localhost:5000/api/complaints/${username}`)
      .then(res => res.json())
      .then(data => setComplaints(data));

  }
}, [activeTab, username]);

  // Upload file → get AI caption
  const handleFileUpload = async (e) => {

    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    const formData = new FormData();
    formData.append("file", selectedFile);

    const res = await fetch("http://localhost:5000/api/caption", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    setCaption(data.caption);
    setIssue(data.issue);   

  };

  // Submit complaint
  const handleSubmitComplaint = async () => {

    const formData = new FormData();

    formData.append("username", username);
    formData.append("mode", mode);
    formData.append("dataType", dataType);
    formData.append("description", description);
    formData.append("caption", caption);
    formData.append("issue", issue);

    if (file) {
      formData.append("file", file);
    }

    const res = await fetch("http://localhost:5000/api/complaints/submit", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    alert(data.message);

    // Reset fields
    setMode("");
    setDataType("");
    setDescription("");
    setIssue("");
    setCaption("");
    setFile(null);
  };

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

            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              <option value="">Mode of Transport</option>
              <option>RTC Bus</option>
              <option>Train</option>
            </select>

            <select
              value={dataType}
              onChange={(e) => setDataType(e.target.value)}
            >
              <option value="">Type of Data</option>
              <option>Text</option>
              <option>Photo</option>
              <option>Video</option>
            </select>

            <input type="file" onChange={handleFileUpload} />

            {caption && (
              <div className="ai-caption">
                <b>AI Generated Caption:</b>
                <p>{caption}</p>
              </div>
            )}

            <textarea
              placeholder="Describe the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <button
              className="submit-btn"
              onClick={handleSubmitComplaint}
            >
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
                  <th>Issue</th>
                  <th>Status</th>
                </tr>
              </thead>

             <tbody>
  {complaints.length === 0 ? (
    <tr>
      <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
        No complaints submitted yet
      </td>
    </tr>
  ) : (
    complaints.map((c, index) => (
      <tr key={index}>
        <td>{c._id.slice(-5)}</td>

        {/* Transport */}
        <td>{c.mode || "N/A"}</td>

        {/* Issue (with color) */}
        <td
          style={{
            color:
              c.issue === "Overcrowding"
                ? "orange"
                :c.issue === "Delay Issue"
                ? "blue"
                : c.issue === "Safety Issue" || c.issue === "Safety"
                ? "red"
                : c.issue === "Cleanliness"
                ? "green"
                : "dark yellow"
          }}
        >
          {c.issue }
        </td>

        {/* Status (with color) */}
        <td
          style={{
            color:
              c.status === "Pending"
                ? "red"
                : c.status === "Resolved"
                ? "lightgreen"
                : "white"
          }}
        >
          {c.status}
        </td>

      </tr>
    ))
  )}
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
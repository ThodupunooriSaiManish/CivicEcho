import { useEffect, useState } from "react";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {

  const [complaints, setComplaints] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const navigate = useNavigate();

  // 🔹 Fetch complaints
  useEffect(() => {
    fetch("http://localhost:5000/api/complaints")
      .then(res => res.json())
      .then(data => setComplaints(data));
  }, []);

  // 🔹 Update status
  const updateStatus = async (id) => {
    await fetch(`http://localhost:5000/api/complaints/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Resolved" })
    });

    // refresh
    fetch("http://localhost:5000/api/complaints")
      .then(res => res.json())
      .then(data => setComplaints(data));
  };

  // ✅ GROUPING (FINAL FIXED VERSION)
  const grouped = {};
  complaints.forEach(c => {
    let issue = c.issue || "Other";

    // normalize values
    if (issue === "Safety") issue = "Safety Issue";
    if (issue === "Cleanliness") issue = "Cleanliness Issue";
    if (issue === "Delay") issue = "Delay Issue";

    if (!grouped[issue]) grouped[issue] = [];
    grouped[issue].push(c);
  });

  return (
    <div className="admin-layout">

      {/* ===== SIDEBAR ===== */}
      <div className="sidebar">
        <h2>Admin</h2>

        <button
          className="analytics-btn"
          onClick={() => navigate("/admin-analytics")}
        >
           Analytics
        </button>

        <div className="menu">
          {Object.keys(grouped).map((issue, i) => (
            <div
              key={i}
              className={`menu-item ${selectedIssue === issue ? "active" : ""}`}
              onClick={() => setSelectedIssue(issue)}
            >
              {selectedIssue === issue ? "▼" : "▶"} {issue} ({grouped[issue].length})
            </div>
          ))}
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="main-content">

        {/* 🟢 WELCOME SCREEN */}
        {!selectedIssue && (
          <div className="welcome">
            <h1>Welcome Admin </h1>
            <p>Select a category from sidebar to view complaints</p>
          </div>
        )}

        {/* 🔵 CATEGORY VIEW */}
        {selectedIssue && (
          <>
            <h2>{selectedIssue} Complaints</h2>

            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Transport</th>
                  <th>Confidence</th>
                  <th>Media</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {grouped[selectedIssue].map((c, index) => (
                  <tr key={index}>
                    <td>{c._id.slice(-5)}</td>
                    <td>{c.username}</td>
                    <td>{c.mode}</td>

                    {/* CONFIDENCE */}
                    <td>{c.confidence ? `${c.confidence}%` : "—"}</td>

                    {/* MEDIA */}
                    <td>
                      {c.file && (
                        c.file.endsWith(".mp4") ? (
                          <video width="80" controls>
                            <source src={`http://localhost:5000/${c.file}`} />
                          </video>
                        ) : (
                          <img
                            src={`http://localhost:5000/${c.file}`}
                            alt=""
                            width="80"
                          />
                        )
                      )}
                    </td>

                    {/* STATUS */}
                    <td className={c.status === "Pending" ? "status-pending" : "status-resolved"}>
                      {c.status}
                    </td>

                    {/* ACTION */}
                    <td>
                      {c.status === "Pending" && (
                        <button
                          className="resolve-btn"
                          onClick={() => updateStatus(c._id)}
                        >
                          Resolve
                        </button>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

      </div>
    </div>
  );
}

export default AdminDashboard;
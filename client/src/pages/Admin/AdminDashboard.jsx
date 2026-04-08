import { useEffect, useState } from "react";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {

  const [complaints, setComplaints] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const navigate = useNavigate();

  const total = complaints.length;
  const resolved = complaints.filter(c => c.status === "Resolved").length;
  const pending = complaints.filter(c => c.status === "Pending").length;

  // ✅ UPDATE ISSUE (Feature 8)
const updateIssue = async (id, newIssue) => {
  await fetch(`http://localhost:5000/api/complaints/update-issue/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ issue: newIssue })
  });

  // ✅ FORCE REFRESH DATA
  const res = await fetch("http://localhost:5000/api/complaints");
  const data = await res.json();

  setComplaints(data);

  // ✅ RESET VIEW TO DASHBOARD (VERY IMPORTANT)
  setSelectedIssue(null);
};

  // 🔹 FETCH
  useEffect(() => {
    fetch("http://localhost:5000/api/complaints")
      .then(res => res.json())
      .then(data => setComplaints(data));
  }, []);

  // 🔹 UPDATE STATUS
  const updateStatus = async (id) => {
    await fetch(`http://localhost:5000/api/complaints/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Resolved" })
    });

    fetch("http://localhost:5000/api/complaints")
      .then(res => res.json())
      .then(data => setComplaints(data));
  };

  // 🔹 GROUPING
  const grouped = {};
  complaints.forEach(c => {
    let issue = c.issue || "Other";

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

      {/* ===== MAIN ===== */}
      <div className="main-content">

        {/* ===== STATS ===== */}
        <div className="stats-container">
          <div className="stat-card"><h3>Total</h3><p>{total}</p></div>
          <div className="stat-card"><h3>Resolved</h3><p>{resolved}</p></div>
          <div className="stat-card"><h3>Pending</h3><p>{pending}</p></div>
        </div>

        {/* ===== WELCOME ===== */}
        {!selectedIssue && (
          <div className="welcome">
            <h1>Welcome Admin</h1>
            <p>Select a category</p>
          </div>
        )}

        {/* ===== CATEGORY ===== */}
        {selectedIssue && (
          <>
            <h2>{selectedIssue} Complaints</h2>

            <button onClick={() => setSelectedIssue(null)}>
              ← Back
            </button>

            {/* 🔍 FILTER */}
            <div style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
              <input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>All</option>
                <option>Pending</option>
                <option>Resolved</option>
              </select>
            </div>

            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Transport</th>
                  <th>Issue</th> {/* ✅ NEW */}
                  <th>Time</th>
                  <th>Confidence</th>
                  <th>Priority</th>
                  <th>Media</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {[...(grouped[selectedIssue] || [])]

                  .filter(c => {
                    const matchesSearch =
                      c.username.toLowerCase().includes(search.toLowerCase()) ||
                      c.issue.toLowerCase().includes(search.toLowerCase());

                    const matchesStatus =
                      statusFilter === "All" || c.status === statusFilter;

                    return matchesSearch && matchesStatus;
                  })

                  .sort((a, b) => (b.priority || 0) - (a.priority || 0))

                  .map((c, index) => (
                    <tr key={index}>
                      <td>{c._id.slice(-5)}</td>
                      <td>{c.username}</td>
                      <td>{c.mode}</td>

                      {/* ✅ FEATURE 8 (DROPDOWN) */}
                      <td>
                        <select
                          value={c.issue}
                          onChange={(e) => updateIssue(c._id, e.target.value)}
                        >
                          <option>Overcrowding</option>
                          <option>Safety Issue</option>
                          <option>Cleanliness Issue</option>
                          <option>Delay Issue</option>
                        </select>
                      </td>

                      <td>{new Date(c.createdAt).toLocaleString()}</td>

                      <td>{c.confidence ? `${c.confidence}%` : "—"}</td>

                      <td style={{
                        color:
                          c.priority >= 90 ? "red" :
                          c.priority >= 70 ? "orange" : "green"
                      }}>
                        {c.priority}
                      </td>

                      <td>
                        {c.file && (
                          <img
                            src={`http://localhost:5000/${c.file}`}
                            width="70"
                            onClick={() => setSelectedComplaint(c)}
                            style={{ cursor: "pointer" }}
                            alt=""
                          />
                        )}
                      </td>

                      <td>
                        {c.status}

                        {/* ✅ FEATURE 10 TIMELINE */}
                        <div style={{ fontSize: "12px", marginTop: "5px" }}>
                          🟡 Submitted <br />
                          {c.status === "Resolved"
                            ? "🟢 Resolved"
                            : "🔴 Pending"}
                        </div>
                      </td>

                      <td>
                        {c.status === "Pending" && (
                          <button onClick={() => updateStatus(c._id)}>
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

        {/* ===== MODAL (FULL DATA) ===== */}
        {selectedComplaint && (
          <div
            className="modal-overlay"
            onClick={() => setSelectedComplaint(null)}
          >
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >

              <img
                src={`http://localhost:5000/${selectedComplaint.file}`}
                style={{ width: "100%", maxHeight: "300px" }}
                alt=""
              />

              <div className="modal-body">
                <h2>Complaint Details</h2>

                <p><b>ID:</b> {selectedComplaint._id}</p>
                <p><b>User:</b> {selectedComplaint.username}</p>
                <p><b>Transport:</b> {selectedComplaint.mode}</p>
                <p><b>Issue:</b> {selectedComplaint.issue}</p>
                <p><b>Confidence:</b> {selectedComplaint.confidence}%</p>
                <p><b>Priority:</b> {selectedComplaint.priority}</p>
                <p><b>Status:</b> {selectedComplaint.status}</p>

                <p><b>Time:</b> {new Date(selectedComplaint.createdAt).toLocaleString()}</p>

                <p><b>Description:</b> {selectedComplaint.description}</p>

                <button onClick={() => setSelectedComplaint(null)}>
                  Close
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminDashboard;
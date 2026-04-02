import { useEffect, useState } from "react";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import ComplaintList from "../../components/ComplaintList";

function AdminDashboard() {
  const [data, setData] = useState({});
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate();

  // 🔹 Fetch all complaints (table view)
  useEffect(() => {
    fetch("http://localhost:5000/api/complaints")
      .then(res => res.json())
      .then(data => setComplaints(data));
  }, []);

  // 🔹 Fetch grouped complaints (sidebar)
  useEffect(() => {
    axios.get("http://localhost:5000/api/admin/grouped-complaints")
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, []);

  // 🔹 Update status
  const updateStatus = async (id) => {
    await fetch(`http://localhost:5000/api/complaints/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status: "Resolved" })
    });

    // refresh
    fetch("http://localhost:5000/api/complaints")
      .then(res => res.json())
      .then(data => setComplaints(data));
  };

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>

      {/* 🔥 NEW LAYOUT */}
      <div className="admin-layout">

        {/* 🔹 Sidebar */}
        <Sidebar data={data} onSelect={setSelectedComplaint} />

        {/* 🔹 Right Content */}
        <div className="main-content">

          {/* 🔹 Selected Complaint View */}
          <ComplaintList complaint={selectedComplaint} />

          <div className="table-card">

            <button
              className="analytics-btn"
              onClick={() => navigate("/admin-analytics")}
            >
              View Analytics
            </button>

            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Transport</th>
                  <th>Issue</th>
                  <th>Confidence</th>
                  <th>Media</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {complaints.map((c, index) => (
                  <tr key={index}>
                    <td>{c._id.slice(-5)}</td>
                    <td>{c.username}</td>
                    <td>{c.mode}</td>

                    {/* 🔥 ISSUE COLOR */}
                    <td
                      className={
                        c.issue === "Overcrowding"
                          ? "issue-overcrowding"
                          : c.issue === "Safety"
                          ? "issue-safety"
                          : c.issue === "Cleanliness"
                          ? "issue-cleanliness"
                          : c.issue === "Delay"
                          ? "issue-delay"
                          : ""
                      }
                    >
                      {c.issue}
                    </td>

                    <td>{c.confidence ? `${c.confidence}%` : "—"}</td>

                    {/* 🔥 MEDIA */}
                    <td>
                      {c.file && (
                        c.file.endsWith(".mp4") ? (
                          <video
                            width="80"
                            onClick={() => setSelectedComplaint(c)}
                            style={{ cursor: "pointer", borderRadius: "6px" }}
                          >
                            <source src={`http://localhost:5000/${c.file}`} />
                          </video>
                        ) : (
                          <img
                            src={`http://localhost:5000/${c.file}`}
                            alt="complaint"
                            width="80"
                            onClick={() => setSelectedComplaint(c)}
                            style={{ cursor: "pointer", borderRadius: "6px" }}
                          />
                        )
                      )}
                    </td>

                    {/* 🔥 STATUS COLOR */}
                    <td
                      className={
                        c.status === "Pending"
                          ? "status-pending"
                          : "status-resolved"
                      }
                    >
                      {c.status}
                    </td>

                    {/* 🔥 ACTION */}
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

            {/* 🔥 MODAL */}
            {selectedComplaint && (
              <div
                className="modal-overlay"
                onClick={() => setSelectedComplaint(null)}
              >
                <div
                  className="modal-content"
                  onClick={(e) => e.stopPropagation()}
                >

                  <div className="modal-media">
                    {selectedComplaint.file.endsWith(".mp4") ? (
                      <video controls>
                        <source src={`http://localhost:5000/${selectedComplaint.file}`} />
                      </video>
                    ) : (
                      <img
                        src={`http://localhost:5000/${selectedComplaint.file}`}
                        alt="complaint"
                      />
                    )}
                  </div>

                  <div className="modal-body">
                    <h2>Complaint Details</h2>

                    <p><b>User:</b> {selectedComplaint.username}</p>
                    <p><b>Transport:</b> {selectedComplaint.mode}</p>
                    <p><b>Issue:</b> {selectedComplaint.issue}</p>
                    <p><b>Confidence:</b> {selectedComplaint.confidence}%</p>
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
      </div>
    </div>
  );
}

export default AdminDashboard;
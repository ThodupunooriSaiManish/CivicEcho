import { useEffect, useState } from "react";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/complaints")
      .then(res => res.json())
      .then(data => setComplaints(data));
  }, []);

  const updateStatus = async (id) => {

  await fetch(`http://localhost:5000/api/complaints/update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ status: "Resolved" })
  });

  // refresh data
  fetch("http://localhost:5000/api/complaints")
    .then(res => res.json())
    .then(data => setComplaints(data));
};

  return (
<div className="admin-container">

      <h2>Admin Dashboard</h2>
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
            <th>Media</th>
            <th>Status</th>
                <th>Action</th> {/* ✅ ADD THIS */}
          </tr>
        </thead>

        <tbody>
          {complaints.map((c, index) => (
            <tr key={index}>
              <td>{c._id.slice(-5)}</td>
              <td>{c.username}</td>
              <td>{c.mode}</td>
<td
  className={
    c.issue === "Overcrowding"
      ? "issue-overcrowding"
      : c.issue === "Safety Issue"
      ? "issue-safety"
      : c.issue === "Cleanliness Issue"
      ? "issue-cleanliness"
      : ""
  }
>
  {c.issue}
</td><td className={c.status === "Pending" ? "status-pending" : "status-resolved"}>
  {c.status}
</td> 
<td>
  {c.file && (
    c.file.endsWith(".mp4") ? (
      <video
        width="80"
        onClick={() => setSelectedComplaint(c)}
        style={{ cursor: "pointer", borderRadius: "6px" }}
      >
        <source src={c.file} />
      </video>
    ) : (
      <img
        src={c.file}
        alt="complaint"
        width="80"
        onClick={() => setSelectedComplaint(c)}
        style={{ cursor: "pointer", borderRadius: "6px" }}
      />
    )
  )}
</td>
<td>
  {c.status === "Pending" && (
   <button
  className="resolve-btn"
  onClick={() => updateStatus(c._id)}
>
  Resolve
</button>
  )}
</td>           </tr>
          ))}
        </tbody>

      </table>
{selectedComplaint && (
  <div className="modal-content" onClick={(e) => e.stopPropagation()}>

  {/* IMAGE */}
  <div className="modal-media">
    {selectedComplaint.file.endsWith(".mp4") ? (
      <video controls>
        <source src={selectedComplaint.file} />
      </video>
    ) : (
      <img src={selectedComplaint.file} alt="complaint" />
    )}
  </div>

  {/* TEXT CONTENT */}
  <div className="modal-body">

    <h2>Complaint Details</h2>

    <p><b>User:</b> {selectedComplaint.username}</p>
    <p><b>Transport:</b> {selectedComplaint.mode}</p>
    <p><b>Issue:</b> {selectedComplaint.issue}</p>
    <p><b>Caption:</b> {selectedComplaint.caption}</p>
    <p><b>Description:</b> {selectedComplaint.description}</p>

    <button onClick={() => setSelectedComplaint(null)}>
      Close
    </button>

  </div>

</div>
)}

    </div>
    </div>

  );
}

export default AdminDashboard;
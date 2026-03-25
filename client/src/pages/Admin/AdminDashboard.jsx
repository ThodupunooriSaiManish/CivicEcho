import { useEffect, useState } from "react";
import "./AdminDashboard.css";

function AdminDashboard() {

  const [complaints, setComplaints] = useState([]);

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

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Transport</th>
            <th>Issue</th>
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

    </div>
    </div>
  );
}

export default AdminDashboard;
import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";
import { useNavigate } from "react-router-dom";   // ✅ ADD THIS
import "./AdminAuth.css";

function AdminAnalytics() {

  const [data, setData] = useState([]);
  const navigate = useNavigate();   // ✅ ADD THIS

  useEffect(() => {
    fetch("http://localhost:5000/api/complaints")
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  // ================= PIE CHART =================

  const allCategories = [
    "Bus - Overcrowding",
    "Bus - Cleanliness Issue",
    "Bus - Safety Issue",
    "Bus - Delay Issue",
    "Train - Overcrowding",
    "Train - Cleanliness Issue",
    "Train - Safety Issue",
    "Train - Delay Issue"
  ];

  const categoryCount = {};

  allCategories.forEach(cat => {
    categoryCount[cat] = 0;
  });

  data.forEach(c => {
    let issue = c.issue;

    if (issue === "Safety") issue = "Safety Issue";

    const key = `${c.mode} - ${issue}`;

    if (categoryCount[key] !== undefined) {
      categoryCount[key]++;
    }
  });

  const pieData = Object.keys(categoryCount)
    .map(key => ({
      name: key,
      value: categoryCount[key]
    }));

  // ================= BAR GRAPH =================
  const issueCount = {};

  data.forEach(c => {
    let issue = c.issue;

    if (issue === "Safety") issue = "Safety Issue";

    issueCount[issue] = (issueCount[issue] || 0) + 1;
  });

  const barData = Object.keys(issueCount).map(key => ({
    name: key,
    value: issueCount[key]
  }));

  const COLORS = [
    "#22c55e",
    "#3b82f6",
    "#f59e0b",
    "#ef4444",
    "#a855f7",
    "#14b8a6",
    "#f97316",
    "#e11d48"
  ];

  return (
    <div className="analytics-container">

      {/* ✅ BACK BUTTON */}
      <button
        onClick={() => navigate("/admin-dashboard")}
        style={{
          marginBottom: "20px",
          padding: "8px 16px",
          borderRadius: "8px",
          border: "none",
          background: "#3b82f6",
          color: "white",
          cursor: "pointer"
        }}
      >
        ⬅ Back to Dashboard
      </button>

      <h2> Analytics Dashboard</h2>

      <div className="analytics-grid">

        {/* ===== PIE CHART ===== */}
        <div className="analytics-card">
          <h3>Transport + Issue Distribution</h3>

          <PieChart width={520} height={380}>
            <Pie
              data={pieData}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={110}
              labelLine={false}
              label={({ name, percent }) => {
                const issue = name.split("-")[1]?.trim();
                return `${issue} ${(percent * 100).toFixed(0)}%`;
              }}
            >
              {pieData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip />
            <Legend verticalAlign="bottom" height={60} />
          </PieChart>
        </div>

        {/* ===== BAR GRAPH ===== */}
        <div className="analytics-card">
          <h3>Issue Comparison</h3>

          <BarChart width={500} height={380} data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

            <XAxis
              dataKey="name"
              stroke="#cbd5f5"
              tick={{ fontSize: 13 }}
            />

            <YAxis
              stroke="#cbd5f5"
              allowDecimals={false}
            />

            <Tooltip />

            <Bar
              dataKey="value"
              fill="#3b82f6"
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </div>

      </div>
    </div>
  );
}

export default AdminAnalytics;
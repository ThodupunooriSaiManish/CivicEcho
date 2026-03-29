import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";
import "./AdminAuth.css";

function AdminAnalytics() {

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/complaints")
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  // ================= PIE CHART =================
  // 🔥 mode + issue (gives all categories like 8 types)
  const categoryCount = {};

  data.forEach(c => {
    let issue = c.issue;

    // normalize
    if (issue === "Safety") issue = "Safety Issue";

    const key = `${c.mode} - ${issue}`;
    categoryCount[key] = (categoryCount[key] || 0) + 1;
  });

  const pieData = Object.keys(categoryCount).map(key => ({
    name: key,
    value: categoryCount[key]
  }));

  // ================= BAR GRAPH =================
  // 🔥 only issue-wise comparison
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

      <h2>📊 Analytics Dashboard</h2>

      <div className="analytics-grid">

        {/* ===== PIE CHART ===== */}
        <div className="analytics-card">
          <h3>Transport + Issue Distribution</h3>

          <PieChart width={350} height={320}>
            <Pie
              data={pieData}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* ===== BAR GRAPH ===== */}
        <div className="analytics-card">
          <h3>Issue Comparison</h3>

          <BarChart width={450} height={320} data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

            <XAxis dataKey="name" stroke="#cbd5f5" />
            <YAxis stroke="#cbd5f5" />

            <Tooltip />

            <Bar
              dataKey="value"
              fill="#3b82f6"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </div>

      </div>
    </div>
  );
}

export default AdminAnalytics;
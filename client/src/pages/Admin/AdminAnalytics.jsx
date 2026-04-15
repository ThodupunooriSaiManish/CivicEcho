import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line   // ✅ ADDED
} from "recharts";
import { useNavigate } from "react-router-dom";
import "./AdminAuth.css";

function AdminAnalytics() {

  const [data, setData] = useState([]);
  const navigate = useNavigate();

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

  const pieData = Object.keys(categoryCount).map(key => ({
    name: key,
    value: categoryCount[key]
  }));

  // ================= BAR GRAPH =================
const issueCount = {
  "Overcrowding": 0,
  "Safety Issue": 0,
  "Cleanliness Issue": 0,
  "Delay Issue": 0
};

data.forEach(c => {
  let issue = c.issue || "Other";

  // ✅ NORMALIZE ALL VALUES
  if (issue === "Safety") issue = "Safety Issue";
  if (issue === "Cleanliness") issue = "Cleanliness Issue";
  if (issue === "Delay") issue = "Delay Issue";

  if (issueCount[issue] !== undefined) {
    issueCount[issue]++;
  }
});

const barData = Object.keys(issueCount).map(key => ({
  name: key.replace(" Issue", ""),
  value: issueCount[key]
}));

  // ================= 📈 LINE GRAPH (NEW) =================
  const trendMap = {};

  data.forEach(c => {
    const date = new Date(c.createdAt).toLocaleDateString();

    if (!trendMap[date]) trendMap[date] = 0;
    trendMap[date]++;
  });

  const lineData = Object.keys(trendMap).map(date => ({
    date,
    count: trendMap[date]
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

      {/* BACK BUTTON */}
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

      <h2>Analytics Dashboard</h2>

      <div className="analytics-grid">

        {/* ===== PIE ===== */}
        <div className="analytics-card">
          <h3>Transport + Issue Distribution</h3>

          <PieChart width={520} height={380}>
            <Pie
              data={pieData}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={110}
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

        {/* ===== BAR ===== */}
        <div className="analytics-card">
          <h3>Issue Comparison</h3>

          <BarChart width={500} height={380} data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#cbd5f5"   />
            <YAxis stroke="#cbd5f5" allowDecimals={false} />
            <Tooltip />

            <Bar
              dataKey="value"
              fill="#3b82f6"
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </div>

        {/* ===== 📈 LINE GRAPH (NEW) ===== */}
        <div className="analytics-card">
          <h3>Complaints Trend (Day-wise)</h3>

          <LineChart width={500} height={300} data={lineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" stroke="#cbd5f5" />
            <YAxis stroke="#cbd5f5" allowDecimals={false} />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="count"
              stroke="#22c55e"
              strokeWidth={3}
            />
          </LineChart>
        </div>

      </div>
    </div>
  );
}

export default AdminAnalytics;
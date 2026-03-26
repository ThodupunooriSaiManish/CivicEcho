import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

function AdminAnalytics() {

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/complaints")
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  // 🔥 Count Transport Types
  const transportCount = {};

  data.forEach(c => {
    transportCount[c.mode] = (transportCount[c.mode] || 0) + 1;
  });

  const transportData = Object.keys(transportCount).map(key => ({
    name: key,
    value: transportCount[key]
  }));


  // 🔥 Count Issue Types
  const issueCount = {};

  data.forEach(c => {
    issueCount[c.issue] = (issueCount[c.issue] || 0) + 1;
  });

  const issueData = Object.keys(issueCount).map(key => ({
    name: key,
    value: issueCount[key]
  }));


  const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444"];

  return (
    <div style={{ padding: "30px", color: "white" }}>

      <h2>Analytics Dashboard</h2>

      <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>

        {/* PIE CHART - TRANSPORT */}
        <div>
          <h3>Transport Types</h3>
          <PieChart width={300} height={300}>
            <Pie
              data={transportData}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {transportData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>


        {/* BAR CHART - ISSUES */}
        <div>
          <h3>Issue Types</h3>
          <BarChart width={400} height={300} data={issueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </div>

      </div>
    </div>
  );
}

export default AdminAnalytics;
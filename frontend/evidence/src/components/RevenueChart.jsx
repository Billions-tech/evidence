// src/components/RevenueChart.jsx
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getAllReceipts } from "../api/receipts";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function RevenueChart() {
  const { token } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReceipts() {
      try {
        const res = await getAllReceipts(token);
        // Group by month/year
        const grouped = {};
        res.data.forEach((r) => {
          const d = new Date(r.createdAt);
          const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
          if (!grouped[key]) grouped[key] = 0;
          grouped[key] += r.amount;
        });
        const chartData = Object.entries(grouped).map(([k, v]) => ({
          month: k,
          revenue: v,
        }));
        setData(chartData);
      } finally {
        setLoading(false);
      }
    }
    fetchReceipts();
  }, [token]);

  if (loading)
    return (
      <div className="text-center mt-10 text-blue-600">Loading chart...</div>
    );

  return (
    <div className="mx-auto  text-white px-6 py-5">
      <h2 className="text-2xl text-center font-bold mb-4">
        Monthly Revenue Chart
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#8884d8" />
          <XAxis dataKey="month" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip
            contentStyle={{ background: "#222", border: "none", color: "#fff" }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#82ca9d"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

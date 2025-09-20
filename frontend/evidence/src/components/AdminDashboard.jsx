import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
import {
  FaUsers,
  FaReceipt,
  FaDownload,
  FaShareAlt,
  FaChartLine,
} from "react-icons/fa";
import { BASE_URL } from "../api/baseUrl";

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const resMetrics = await fetch(`${BASE_URL}/metrics`);
        const resActivity = await fetch(`${BASE_URL}/activity`);
        console.log("Metrics response:", resMetrics);
        console.log("Activity response:", resActivity);
        setMetrics(await resMetrics.json());
        setActivity(await resActivity.json());
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <div>Basho...</div>;
  }

  // Prepare chart data
  const usageByDate = {};
  activity.forEach((log) => {
    const date = new Date(log.timestamp).toLocaleDateString();
    if (!usageByDate[date]) usageByDate[date] = { downloads: 0, shares: 0 };
    if (log.action === "download") usageByDate[date].downloads++;
    if (log.action === "share") usageByDate[date].shares++;
  });
  const chartLabels = Object.keys(usageByDate);
  const downloadsData = chartLabels.map((d) => usageByDate[d].downloads);
  const sharesData = chartLabels.map((d) => usageByDate[d].shares);
  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Downloads",
        data: downloadsData,
        borderColor: "#60a5fa",
        backgroundColor: "rgba(96,165,250,0.2)",
      },
      {
        label: "Shares",
        data: sharesData,
        borderColor: "#a78bfa",
        backgroundColor: "rgba(167,139,250,0.2)",
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Downloads & Shares Over Time" },
    },
    scales: {
      x: { grid: { color: "#6366f1" }, ticks: { color: "#c7d2fe" } },
      y: { grid: { color: "#6366f1" }, ticks: { color: "#c7d2fe" } },
    },
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-700 p-6 font-sans">
      <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white/10 rounded-xl p-6 flex flex-col items-center shadow-lg">
          <FaUsers className="text-3xl text-yellow-400 mb-2" />
          <div className="text-lg text-white font-bold">Users</div>
          <div className="text-2xl text-indigo-100">
            {metrics?.users ?? "-"}
          </div>
        </div>
        <div className="bg-white/10 rounded-xl p-6 flex flex-col items-center shadow-lg">
          <FaReceipt className="text-3xl text-green-400 mb-2" />
          <div className="text-lg text-white font-bold">Receipts</div>
          <div className="text-2xl text-indigo-100">
            {metrics?.receipts ?? "-"}
          </div>
        </div>
        <div className="bg-white/10 rounded-xl p-6 flex flex-col items-center shadow-lg">
          <FaDownload className="text-3xl text-blue-400 mb-2" />
          <div className="text-lg text-white font-bold">Downloads</div>
          <div className="text-2xl text-indigo-100">
            {metrics?.downloads ?? "-"}
          </div>
        </div>
        <div className="bg-white/10 rounded-xl p-6 flex flex-col items-center shadow-lg">
          <FaShareAlt className="text-3xl text-purple-400 mb-2" />
          <div className="text-lg text-white font-bold">Shares</div>
          <div className="text-2xl text-indigo-100">
            {metrics?.shares ?? "-"}
          </div>
        </div>
      </div>
      {/* Recent Activity Table */}
      <div className="bg-white/10 rounded-xl p-6 shadow-lg mb-10 overflow-x-auto">
        <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="text-indigo-200">
              <th className="py-2 px-2">User</th>
              <th className="py-2 px-2">Business</th>
              <th className="py-2 px-2">Action</th>
              <th className="py-2 px-2">Details</th>
              <th className="py-2 px-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {activity.map((log, idx) => (
              <tr
                key={idx}
                className="border-t border-indigo-800 text-indigo-100"
              >
                <td className="py-2 px-2">{log.userName || log.userId}</td>
                <td className="py-2 px-2">{log.businessName || "-"}</td>
                <td className="py-2 px-2">{log.action}</td>
                <td className="py-2 px-2">{log.details}</td>
                <td className="py-2 px-2">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Usage Chart */}
      <div className="bg-white/10 rounded-xl p-6 shadow-lg flex flex-col items-center">
        <FaChartLine className="text-3xl text-yellow-400 mb-2" />
        <div className="text-lg text-white font-bold mb-2">Usage Over Time</div>
        <div className="w-full h-64 flex items-center justify-center">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

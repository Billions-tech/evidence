// src/components/Dashboard.jsx
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getDashboardSummary } from "../api/receipts";
import {
  FaMoneyBillWave,
  FaReceipt,
  FaChartLine,
  FaPlus,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { token, user } = useContext(AuthContext);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMonth, setActiveMonth] = useState(new Date());
  const navigate = useNavigate();

  // Fetch summary for active month
  useEffect(() => {
    if (!token || !user) {
      navigate("/login");
      return;
    }
    async function fetchSummary(month, year) {
      setLoading(true);
      try {
        const res = await getDashboardSummary({
          month: month + 1,
          year,
          token,
        });
        setSummary(res.data);
        // Debug: log summary and recentReceipts
        console.log("Dashboard summary:", res.data);
        if (res.data.recentReceipts) {
          res.data.recentReceipts.forEach((r, idx) => {
            let amount = 0;
            if (r.items && Array.isArray(r.items) && r.items.length > 0) {
              amount = r.items.reduce((sum, i) => sum + (i.total || 0), 0);
            } else {
              amount = r.amount || 0;
            }
            console.log(
              `Receipt[${idx}] id=${r.id}, customer=${r.customer}, amount=`,
              amount,
              "items:",
              r.items
            );
          });
        }
      } finally {
        setLoading(false);
      }
    }
    fetchSummary(activeMonth.getMonth(), activeMonth.getFullYear());
    // Expose global update function for delete
    window.updateDashboardSummary = () => {
      fetchSummary(activeMonth.getMonth(), activeMonth.getFullYear());
    };
    return () => {
      window.updateDashboardSummary = undefined;
    };
  }, [token, user, navigate, activeMonth]);

  if (loading)
    return (
      <div className="text-center mt-10 text-blue-600">
        Loading dashboard...
      </div>
    );

  // Month name for display
  const monthName = activeMonth.toLocaleString("default", { month: "short" });
  const yearNum = activeMonth.getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white p-4">
      {/* Month Selector */}
      <div className="flex justify-center mb-8">
        <div className="bg-white/10 rounded-lg px-4 py-2 text-indigo-200 font-semibold flex items-center gap-2">
          <span>Showing:</span>
          <span className="text-indigo-100">
            {monthName} {yearNum}
          </span>
          <button
            className="ml-2 px-2 py-1 bg-indigo-700 text-white rounded"
            onClick={() =>
              setActiveMonth(new Date(yearNum, activeMonth.getMonth() - 1, 1))
            }
            disabled={loading}
          >
            &lt;
          </button>
          <button
            className="px-2 py-1 bg-indigo-700 text-white rounded"
            onClick={() =>
              setActiveMonth(new Date(yearNum, activeMonth.getMonth() + 1, 1))
            }
            disabled={loading}
          >
            &gt;
          </button>
        </div>
      </div>
      {/* Summary Cards - Always Row, Responsive */}
      <div className="flex  gap-2 sm:gap-4 mb-8 mx-auto justify-center items-center">
        <div className="flex-1 min-w-[120px] max-w-[220px] bg-gradient-to-br from-indigo-700 to-indigo-900 rounded-xl p-3 sm:p-4 flex flex-col items-center shadow-lg">
          <FaMoneyBillWave className="text-2xl sm:text-3xl mb-2 text-green-400" />
          <div className="text-sm sm:text-lg">{monthName} Revenue</div>
          <div className="text-lg sm:text-2xl font-bold">
            ₦{summary?.monthRevenue?.toLocaleString()}
          </div>
        </div>
        <div className="flex-1 min-w-[120px] max-w-[220px] bg-gradient-to-br from-purple-700 to-purple-900 rounded-xl p-3 sm:p-4 flex flex-col items-center shadow-lg">
          <FaChartLine className="text-2xl sm:text-3xl mb-2 text-yellow-400" />
          <div className="text-sm sm:text-lg">Total Revenue</div>
          <div className="text-lg sm:text-2xl font-bold">
            ₦{summary?.totalRevenue?.toLocaleString()}
          </div>
        </div>
        <div className="flex-1 min-w-[120px] max-w-[220px] bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl p-3 sm:p-4 flex flex-col items-center shadow-lg">
          <FaReceipt className="text-2xl sm:text-3xl mb-2 text-pink-400" />
          <div className="text-sm sm:text-lg">{monthName} Receipts</div>
          <div className="text-lg sm:text-2xl font-bold">
            {summary?.monthReceiptCount ?? summary?.receiptCount}
          </div>
        </div>
      </div>

      {/* Recent Receipts - Responsive Table */}
      <div className="bg-white/10 rounded-xl p-4 sm:p-6 mb-8 shadow-lg overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-indigo-200">
            Recent Receipts
          </h2>
          <Link to="/receipts" className="text-indigo-300 hover:underline">
            View All
          </Link>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-indigo-800 text-indigo-300">
              <th className="py-2 px-2">Customer</th>
              <th className="py-2 px-2">Amount</th>
              <th className="py-2 px-2">Date</th>
              <th className="py-2 px-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {summary?.recentReceipts?.length === 0 && (
              <tr>
                <td colSpan={4} className="text-gray-300 py-2">
                  No receipts yet.
                </td>
              </tr>
            )}
            {(summary?.recentReceipts || []).slice(0, 6).map((r) => {
              // Calculate amount: sum items if present, else use r.amount
              let amount = 0;
              if (r.items && Array.isArray(r.items) && r.items.length > 0) {
                amount = r.items.reduce((sum, i) => sum + (i.total || 0), 0);
              } else {
                amount = r.amount || 0;
              }
              return (
                <tr
                  key={r.id}
                  className="border-b border-indigo-800 last:border-b-0"
                >
                  <td className="py-2 px-2 font-medium">{r.customer}</td>
                  <td className="py-2 px-2 text-indigo-100">
                    ₦{amount.toLocaleString()}
                  </td>
                  <td className="py-2 px-2 text-xs text-indigo-300">
                    {r.createdAt
                      ? new Date(r.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="py-2 px-2">
                    <Link
                      to={`/receipt/${r.id}`}
                      className="text-blue-400 hover:underline ml-2"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Main Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <Link
          to="/create-receipt"
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-full shadow-lg text-lg font-semibold transition"
        >
          <FaPlus /> Create Receipt
        </Link>
        {/* Placeholder for future chart */}
        <Link
          to="/revenue-chart"
          className="flex items-center gap-2 text-indigo-300 hover:underline"
        >
          <FaChartLine /> Monthly Revenue Chart
        </Link>
      </div>
    </div>
  );
}

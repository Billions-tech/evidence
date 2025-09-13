// src/components/RecentReceipts.jsx
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaReceipt, FaTrash, FaSearch } from "react-icons/fa";
import { deleteReceipt } from "../api/receipts";
import { showSuccess, showError } from "./SweetAlert";
import Swal from "sweetalert2";

function filterByPeriod(receipts, period) {
  const now = new Date();
  if (period === "week") {
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    return receipts.filter((r) => new Date(r.createdAt) >= startOfWeek);
  }
  if (period === "month") {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return receipts.filter((r) => new Date(r.createdAt) >= startOfMonth);
  }
  return receipts;
}

function RecentReceipts() {
  const { token } = useContext(AuthContext);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    async function fetchReceipts() {
      setLoading(true);
      try {
        // If filtering by a specific month, fetch from summary endpoint
        if (period === "month" && selectedMonth && selectedYear) {
          const res = await axios.get(
            `http://localhost:5001/api/receipts/dashboard/summary?month=${selectedMonth}&year=${selectedYear}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setReceipts(res.data?.monthReceipts || []);
        } else {
          const res = await axios.get("http://localhost:5001/api/receipts", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setReceipts(res.data);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchReceipts();
  }, [token, period, selectedMonth, selectedYear]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Receipt?",
      text: "Are you sure you want to delete this receipt? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
    if (!result.isConfirmed) return;
    setDeletingId(id);
    try {
      await deleteReceipt(id, token);
      setReceipts((prev) => prev.filter((r) => r.id !== id));
      showSuccess("Receipt deleted successfully.");
      // Update dashboard summary if available
      if (window.updateDashboardSummary) window.updateDashboardSummary();
    } catch (err) {
      console.error(err);
      showError("Failed to delete receipt.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredReceipts =
    period === "month"
      ? receipts.filter((r) =>
          r.customer.toLowerCase().includes(search.toLowerCase())
        )
      : filterByPeriod(receipts, period).filter((r) =>
          r.customer.toLowerCase().includes(search.toLowerCase())
        );

  if (loading)
    return (
      <div className="text-center mt-10 text-blue-600">Loading receipts...</div>
    );

  return (
    <div className=" mx-auto   text-white  px-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FaReceipt /> All Receipts
      </h2>
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
        <div className="flex items-center bg-white/10 rounded-lg px-3 py-2 w-full">
          <FaSearch className="text-indigo-300 mr-2" />
          <input
            type="text"
            placeholder="Search by customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-white placeholder-indigo-300 w-full"
          />
        </div>
        <div className="flex gap-2 items-center">
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              period === "all"
                ? "bg-indigo-700 text-white"
                : "bg-white/10 text-indigo-200"
            }`}
            onClick={() => setPeriod("all")}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              period === "week"
                ? "bg-purple-700 text-white"
                : "bg-white/10 text-purple-200"
            }`}
            onClick={() => setPeriod("week")}
          >
            This Week
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              period === "month"
                ? "bg-pink-700 text-white"
                : "bg-white/10 text-pink-200"
            }`}
            onClick={() => setPeriod("month")}
          >
            Month
          </button>
          {period === "month" && (
            <>
              <select
                className="ml-2 px-2 py-1 rounded bg-indigo-900 text-white border border-indigo-700"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString("default", {
                      month: "long",
                    })}
                  </option>
                ))}
              </select>
              <select
                className="ml-2 px-2 py-1 rounded bg-indigo-900 text-white border border-indigo-700"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                {Array.from({ length: 5 }, (_, i) => {
                  const y = new Date().getFullYear() - i;
                  return (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  );
                })}
              </select>
            </>
          )}
        </div>
      </div>
      <ul>
        {filteredReceipts.length === 0 && (
          <li className="text-gray-300">No receipts found.</li>
        )}
        {filteredReceipts.map((r) => (
          <li
            key={r.id}
            className="flex justify-between items-center py-3 border-b border-indigo-800 last:border-b-0"
          >
            <span className="font-medium">{r.customer}</span>
            <span className="text-indigo-100">
              {(() => {
                let amount = 0;
                if (r.items && Array.isArray(r.items) && r.items.length > 0) {
                  amount = r.items.reduce((sum, i) => sum + (i.total || 0), 0);
                } else if (typeof r.amount === "number") {
                  amount = r.amount;
                } else if (typeof r.total === "number") {
                  amount = r.total;
                } else {
                  amount = 0;
                }
                return amount > 0 ? `₦${amount.toLocaleString()}` : "-";
              })()}
            </span>
            <span className="text-xs text-indigo-300">
              {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "-"}
            </span>
            <Link
              to={`/receipt/${r.id}`}
              className="text-blue-400 hover:underline ml-2"
            >
              View
            </Link>
            <button
              title="Delete"
              onClick={() => handleDelete(r.id)}
              className="ml-2 text-red-400 hover:text-red-600 focus:outline-none"
              disabled={deletingId === r.id}
            >
              <FaTrash />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecentReceipts;

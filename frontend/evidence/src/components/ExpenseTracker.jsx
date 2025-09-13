import React, { useState, useEffect, useContext } from "react";
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../api/expenses";
import { AuthContext } from "../context/AuthContext";
import { FaCalculator, FaEdit, FaTrash, FaMoneyBillWave } from "react-icons/fa";
import { getDashboardSummary } from "../api/receipts";

function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [monthRevenue, setMonthRevenue] = useState(0);
  const { token } = useContext(AuthContext);

  // Fetch expenses and revenue
  useEffect(() => {
    if (token) {
      fetchExpenses();
      fetchMonthRevenue();
    }
    // eslint-disable-next-line
  }, [token]);

  // Get current month/year
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const fetchMonthRevenue = async () => {
    try {
      const res = await getDashboardSummary({ month, year, token });
      setMonthRevenue(res.data?.monthRevenue || 0);
    } catch (err) {
      console.error(err);
      setMonthRevenue(0);
    }
  };

  const fetchExpenses = async () => {
    try {
      const data = await getExpenses(token);
      setExpenses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setExpenses([]);
    }
  };

  const handleAddOrEdit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !amount) return;
    try {
      if (editId) {
        await updateExpense(
          editId,
          { title, amount: parseFloat(amount), category, note },
          token
        );
      } else {
        await createExpense(
          { title, amount: parseFloat(amount), category, note },
          token
        );
      }
      fetchExpenses();
    } catch (err) {
      console.error(err);
    }
    setTitle("");
    setAmount("");
    setCategory("");
    setNote("");
    setEditId(null);
    setModalOpen(false);
  };

  const handleEdit = (exp) => {
    setTitle(exp.title);
    setAmount(exp.amount);
    setCategory(exp.category || "");
    setNote(exp.note || "");
    setEditId(exp.id);
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setTitle("");
    setAmount("");
    setCategory("");
    setNote("");
    setEditId(null);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this expense?")) {
      try {
        await deleteExpense(id, token);
        fetchExpenses();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const total = Array.isArray(expenses)
    ? expenses.reduce((sum, e) => sum + e.amount, 0)
    : 0;
  const profit = monthRevenue - total;

  return (
    <div className="max-w-xl mx-auto p-2 py-5">
      <h2 className="text-3xl font-bold mb-8 flex items-center text-center text-indigo-200">
        <span className="mr-2">
          <FaCalculator />
        </span>
        Expense Tracker
      </h2>
      <div className="flex sm:flex-row gap-4 mb-6 justify-center items-center">
        <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-xl p-4 flex flex-col items-center shadow-lg min-w-[140px]">
          <FaMoneyBillWave className="text-2xl mb-2 text-green-300" />
          <div className="text-base text-green-300">Profit </div>
          <div className="text-xl font-bold text-green-300">
            ₦{profit.toLocaleString()}
          </div>
        </div>
        <div className="bg-gradient-to-br from-indigo-700 to-indigo-900 rounded-xl p-4 flex flex-col items-center shadow-lg min-w-[140px]">
          <FaMoneyBillWave className="text-2xl mb-2 text-green-100" />
          <div className="text-base text-green-100">Total Expenses</div>
          <div className="text-xl font-bold text-green-100">
            ₦{total.toLocaleString()}
          </div>
        </div>
      </div>
      <button
        onClick={handleAddNew}
        className="mb-6 px-6 py-2 rounded bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg"
      >
        Add Expense
      </button>
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white/10 rounded-xl p-6 shadow-lg w-full max-w-md relative border border-indigo-700">
            <button
              className="absolute top-2 right-3 text-indigo-200 text-xl font-bold hover:text-white"
              onClick={() => setModalOpen(false)}
            >
              &times;
            </button>
            <form onSubmit={handleAddOrEdit}>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mb-3 px-4 py-2 rounded bg-white/20 text-white placeholder-indigo-300 border border-indigo-700 outline-none"
              />
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full mb-3 px-4 py-2 rounded bg-white/20 text-white placeholder-indigo-300 border border-indigo-700 outline-none"
              />
              <input
                type="text"
                placeholder="Category (optional)"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full mb-3 px-4 py-2 rounded bg-white/20 text-white placeholder-indigo-300 border border-indigo-700 outline-none"
              />
              <textarea
                placeholder="Note (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                className="w-full mb-3 px-4 py-2 rounded bg-white/20 text-white placeholder-indigo-300 border border-indigo-700 outline-none resize-none"
              />
              <button
                type="submit"
                className="w-full py-2 rounded bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg"
              >
                {editId ? "Update Expense" : "Add Expense"}
              </button>
            </form>
          </div>
        </div>
      )}
      <ul className="space-y-4">
        {expenses.length === 0 && (
          <li className="text-gray-300 text-center">No expenses yet.</li>
        )}
        {expenses.map((exp) => (
          <li
            key={exp.id}
            className="bg-white/10 rounded-xl p-3 shadow flex justify-between"
          >
            <div className="flex flex-col ">
              <div className="font-bold text-indigo-200 text-lg mb-1">
                {exp.title}
              </div>
              <div className="text-green-300 mb-1">
                ₦{exp.amount.toLocaleString()}
              </div>
              {exp.category && (
                <div className="text-white mb-1">Category: {exp.category}</div>
              )}
              {exp.note && (
                <div className="text-white mb-1">Note: {exp.note}</div>
              )}
              <div className="text-xs text-gray-400">
                {new Date(exp.date).toLocaleDateString()}
              </div>
            </div>
            <div className="flex gap-3 ">
              <button
                className="rounded text-white font-semibold hover:bg-indigo-800"
                onClick={() => handleEdit(exp)}
              >
                <FaEdit />
              </button>
              <button
                className="rounded text-white font-semibold hover:bg-red-800"
                onClick={() => handleDelete(exp.id)}
              >
                <FaTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExpenseTracker;

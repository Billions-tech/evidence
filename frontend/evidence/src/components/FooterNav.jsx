// src/components/FooterNav.jsx
import { FaHome, FaPlus, FaReceipt, FaChartLine, FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function FooterNav() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-indigo-900 via-purple-900 to-black text-white py-5 shadow-lg z-50">
      <div className="max-w-4xl mx-auto flex justify-center gap-12 text-3xl">
        <Link
          to="/dashboard"
          className="hover:text-indigo-300"
          title="Dashboard"
        >
          <FaHome />
        </Link>
        <Link
          to="/create-receipt"
          className="hover:text-purple-300"
          title="Create Receipt"
        >
          <FaPlus />
        </Link>
        <Link
          to="/receipts"
          className="hover:text-pink-300"
          title="All Receipts"
        >
          <FaReceipt />
        </Link>
        <Link to="/menu" className="hover:text-green-300" title="Menu">
          <FaBars />
        </Link>
      </div>
    </footer>
  );
}

import React from "react";
import {
  FaQrcode,
  FaUser,
  FaStickyNote,
  FaChartLine,
  FaMoneyBillWave,
  FaCalculator,
  FaAppStore,
  FaBoxOpen,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const features = [
  { name: "Scan Receipt", icon: <FaQrcode />, path: "/scan" },
  { name: "Notes", icon: <FaStickyNote />, path: "/notes" },
  { name: "Inventory", icon: <FaBoxOpen />, path: "/inventory" },
  { name: "Revenue Chart", icon: <FaChartLine />, path: "/revenue-chart" },
  {
    name: "Expense Tracker",
    icon: <FaMoneyBillWave />,
    path: "/expense-tracker",
  },
  { name: "Calculator", icon: <FaCalculator />, path: "/calculator" },
  { name: "Profile", icon: <FaUser />, path: "/profile" },
];

function Menu() {
  return (
    <div className="max-w-xl mx-auto p-2 py-5">
      <h2 className="text-3xl font-bold mb-8 flex items-center text-center text-indigo-200">
        <span className="mr-2">
          <FaAppStore />
        </span>
        App Features
      </h2>
      <ul className="space-y-6">
        {features.map((f, idx) => (
          <li
            key={idx}
            className="flex items-center gap-4 bg-white/10 rounded-xl p-5 shadow-lg hover:bg-indigo-900 transition"
          >
            <span className="text-3xl text-indigo-300">{f.icon}</span>
            <Link
              to={f.path}
              className="text-xl font-semibold text-white hover:underline"
            >
              {f.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Menu;

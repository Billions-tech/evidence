// src/components/ReceiptForm.jsx

import { useState, useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { createReceipt } from "../api/receipts";
import { AuthContext } from "../context/AuthContext";
import ReceiptDisplay from "./ReceiptDisplay";
import { showError, showSuccess } from "./SweetAlert";
import {
  FaUser,
  FaMoneyBillWave,
  FaRegCommentDots,
  FaRegStickyNote,
} from "react-icons/fa";

export default function ReceiptForm() {
  const [customer, setCustomer] = useState("");
  const [items, setItems] = useState([
    { item: "", unit: "", price: "", total: "" },
  ]);
  const [footerMsg, setFooterMsg] = useState("");
  const [receipt, setReceipt] = useState(null);
  const { token } = useContext(AuthContext);

  const mutation = useMutation({
    mutationFn: (newReceipt) => createReceipt(newReceipt, token),
    onSuccess: (response) => {
      setReceipt(response.data);
      showSuccess("Receipt created successfully!");
    },
    onError: (error) => {
      showError(
        error?.response?.data?.error ||
          "Error creating receipt. Please try again."
      );
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      customer,
      items: items.map((i) => ({
        ...i,
        price: parseFloat(i.price) || 0,
        total: parseFloat(i.total) || 0,
      })),
      footerMsg,
    });
  };

  return (
    <>
      <div className=" bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white flex items-center justify-center p-2 py-5">
        <div className="max-w-lg w-full bg-white/10 rounded-2xl shadow-2xl p-4">
          <h1 className="text-3xl font-extrabold mb-6 text-center tracking-wider text-indigo-200">
            Create Receipt
          </h1>
          <form onSubmit={handleSubmit} className="space-y-5 mb-5">
            <div className="flex items-center border border-indigo-700 bg-white/20 p-3 rounded-lg">
              <FaUser className="mr-3 text-indigo-300 text-xl" />
              <input
                type="text"
                placeholder="Customer Name"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                className="w-full bg-transparent outline-none text-white placeholder-indigo-300"
                required
              />
            </div>
            {/* Items Section */}
            <div className="mb-4">
              <h2 className="text-lg font-bold mb-2 text-indigo-200">Items</h2>
              {items.map((itm, idx) => (
                <div key={idx} className="flex gap-2 mb-2 items-center">
                  <input
                    type="text"
                    placeholder="Item"
                    value={itm.item}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[idx].item = e.target.value;
                      setItems(newItems);
                    }}
                    className="bg-white/20 border border-indigo-700 rounded px-2 py-1 text-white w-1/3"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Unit"
                    value={itm.unit}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[idx].unit = e.target.value;
                      setItems(newItems);
                    }}
                    className="bg-white/20 border border-indigo-700 rounded px-2 py-1 text-white w-1/4"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={itm.price}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[idx].price = e.target.value;
                      // Auto-calc total
                      newItems[idx].total =
                        (parseFloat(e.target.value) || 0) *
                        (parseFloat(newItems[idx].unit) || 1);
                      setItems(newItems);
                    }}
                    className="bg-white/20 border border-green-700 rounded px-2 py-1 text-white w-1/4"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Total"
                    value={itm.total}
                    readOnly
                    className="bg-white/20 border border-purple-700 rounded px-2 py-1 text-white w-1/4"
                  />
                  <button
                    type="button"
                    className="ml-2 text-red-400 font-bold"
                    onClick={() => {
                      const newItems = items.filter((_, i) => i !== idx);
                      setItems(
                        newItems.length
                          ? newItems
                          : [{ item: "", unit: "", price: "", total: "" }]
                      );
                    }}
                  >
                    &times;
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="mt-2 px-3 py-1 bg-indigo-700 text-white rounded shadow"
                onClick={() =>
                  setItems([
                    ...items,
                    { item: "", unit: "", price: "", total: "" },
                  ])
                }
              >
                + Add Item
              </button>
            </div>
            <div className="flex items-center border border-indigo-700 bg-white/20 p-3 rounded-lg">
              <FaRegStickyNote className="mr-3 text-yellow-300 text-xl" />
              <input
                type="text"
                placeholder="Footer Message (optional)"
                value={footerMsg}
                onChange={(e) => setFooterMsg(e.target.value)}
                className="w-full bg-transparent outline-none text-white placeholder-yellow-300"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center transition"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Creating..." : "Create Receipt"}
            </button>
          </form>
          {receipt && <ReceiptDisplay receipt={receipt} />}
        </div>
      </div>
    </>
  );
}

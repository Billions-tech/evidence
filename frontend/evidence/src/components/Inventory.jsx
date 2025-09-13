import  { useState, useEffect, useContext } from "react";
import {
  getInventory,
  createInventory,
  updateInventory,
  deleteInventory,
} from "../api/inventory";
import { AuthContext } from "../context/AuthContext";
import { FaBoxOpen, FaEdit, FaTrash, FaPlus } from "react-icons/fa";

function Inventory() {
  const [items, setItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    sku: "",
    quantity: 0,
    costPrice: 0,
    salePrice: 0,
  });
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (token) fetchInventory();
    // eslint-disable-next-line
  }, [token]);

  const fetchInventory = async () => {
    try {
      const data = await getInventory(token);
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
        console.error("Error fetching inventory:", err);
      setItems([]);
    }
  };

  const handleAddOrEdit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.salePrice) return;
    try {
      if (editId) {
        await updateInventory(editId, form, token);
      } else {
        await createInventory(form, token);
      }
      fetchInventory();
    } catch (err) {
      console.error("Error adding/updating inventory:", err);
    }
    setForm({ name: "", sku: "", quantity: 0, costPrice: 0, salePrice: 0 });
    setEditId(null);
    setModalOpen(false);
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      sku: item.sku || "",
      quantity: item.quantity,
      costPrice: item.costPrice,
      salePrice: item.salePrice,
    });
    setEditId(item.id);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this inventory item?")) {
      try {
        await deleteInventory(id, token);
        fetchInventory();
      } catch (err) {
        console.error("Error deleting inventory item:", err);
      }
    }
  };

  const handleAddNew = () => {
    setForm({ name: "", sku: "", quantity: 0, costPrice: 0, salePrice: 0 });
    setEditId(null);
    setModalOpen(true);
  };

  return (
    <div className="max-w-2xl mx-auto p-2 py-5">
      <h2 className="text-3xl font-bold mb-8 flex items-center text-center text-indigo-200">
        <span className="mr-2">
          <FaBoxOpen />
        </span>
        Inventory
      </h2>
      <button
        onClick={handleAddNew}
        className="mb-6 px-6 py-2 rounded bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg"
      >
        <FaPlus className="inline mr-1" /> Add Item
      </button>
      <div className="overflow-x-auto">
        <table className="w-full text-left bg-white/10 rounded-xl">
          <thead>
            <tr className="border-b border-indigo-800 text-center text-indigo-300">
              <th className="py-2 px-2">Name</th>
              <th className="py-2 px-2">SN</th>
              <th className="py-2 px-2">Qty</th>
              <th className="py-2 px-2">Cost Price</th>
              <th className="py-2 px-2">Sale Price</th>
              <th className="py-2 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="text-gray-300 py-2 text-center">
                  No inventory items yet.
                </td>
              </tr>
            )}
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-indigo-800 text-center text-indigo-100 last:border-b-0"
              >
                <td className="py-2 px-2 font-medium">{item.name}</td>
                <td className="py-2 px-2">{item.sku}</td>
                <td className="py-2 px-2">{item.quantity}</td>
                <td className="py-2 px-2">
                  ₦{item.costPrice.toLocaleString()}
                </td>
                <td className="py-2 px-2">
                  ₦{item.salePrice.toLocaleString()}
                </td>
                <td className="py-2 px-2">
                  <button
                    className="text-yellow-400 hover:text-yellow-200 mr-2"
                    onClick={() => handleEdit(item)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-400 hover:text-red-200"
                    onClick={() => handleDelete(item.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 overflow-y-auto">
          <div className="bg-white/10 rounded-xl p-6 shadow-lg w-full max-w-md relative border border-indigo-700">
            <button
              className="absolute top-2 right-3 text-indigo-200 text-xl font-bold hover:text-white"
              onClick={() => setModalOpen(false)}
            >
              ×
            </button>
            <form onSubmit={handleAddOrEdit}>
              <div className="mb-4">
                <label className="block text-indigo-200 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full rounded px-3 py-2 bg-indigo-950 text-white border border-indigo-700"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-indigo-200 mb-1">SKU</label>
                <input
                  type="text"
                  className="w-full rounded px-3 py-2 bg-indigo-950 text-white border border-indigo-700"
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-indigo-200 mb-1">Quantity</label>
                <input
                  type="number"
                  className="w-full rounded px-3 py-2 bg-indigo-950 text-white border border-indigo-700"
                  value={form.quantity}
                  onChange={(e) =>
                    setForm({ ...form, quantity: Number(e.target.value) })
                  }
                  min={0}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-indigo-200 mb-1">Cost Price</label>
                <input
                  type="number"
                  className="w-full rounded px-3 py-2 bg-indigo-950 text-white border border-indigo-700"
                  value={form.costPrice}
                  onChange={(e) =>
                    setForm({ ...form, costPrice: Number(e.target.value) })
                  }
                  min={0}
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-indigo-200 mb-1">Sale Price</label>
                <input
                  type="number"
                  className="w-full rounded px-3 py-2 bg-indigo-950 text-white border border-indigo-700"
                  value={form.salePrice}
                  onChange={(e) =>
                    setForm({ ...form, salePrice: Number(e.target.value) })
                  }
                  min={0}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg"
              >
                {editId ? "Update" : "Add"} Item
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;

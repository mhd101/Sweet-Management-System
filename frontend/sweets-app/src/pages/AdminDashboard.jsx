import { useState } from "react";
import { useSweets } from "../context/SweetsContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// list of all categories
const categories = ["cake", "candy", "cookie", "pie", "other"];

export default function AdminDashboard() {
  const { sweets, addSweet, updateSweet, deleteSweet, restockSweet } = useSweets(); // sweets context

  const navigate = useNavigate()

  const { logout } = useAuth(); // logout context

  // add form state
  const [form, setForm] = useState({ name: "", price: 0, category: "cake", quantity: 0 });

  // edit form state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", price: 0, category: "cake" });

  // restock state
  const [restockId, setRestockId] = useState(null);
  const [restockValue, setRestockValue] = useState(0);

  // add sweet
  const submit = async (e) => {
    e.preventDefault();
    await addSweet(form);
    setForm({ name: "", price: 0, category: "cake", quantity: 0 });
  };

  // edit sweet
  const startEditing = (sweet) => {
    setEditingId(sweet._id);
    setEditForm({
      name: sweet.name,
      price: sweet.price,
      category: sweet.category,
    });
  };

  // update sweet
  const handleUpdate = async (id) => {
    await updateSweet(id, editForm);
    setEditingId(null);
  };

  // restock sweet
  const handleRestock = async (id) => {
    if (restockValue > 0) {
      await restockSweet(id, restockValue);
      setRestockId(null);
      setRestockValue(0);
    }
  };

  // handle logout
  const handleLogout = () => {
    logout();
    toast.success("Logout successfully")
    navigate("/admin-login"); // redirect to admin login
  };

  return (
    <div className="p-6 max-w-6xl mx-auto relative">

      {/* logout button */}
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md cursor-pointer transition"
      >
        Logout
      </button>

      {/* dashboard heading */}
      <h2 className="text-4xl font-semibold mb-4 text-center">
        Admin Dashboard - Manage Sweets
      </h2>

      {/* form to add a sweet */}
      <h2 className="text-2xl font-semibold text-center mb-6">Add a new Sweet</h2>
      <div className="bg-white p-6 rounded shadow mb-8">
        <form onSubmit={submit} className="flex flex-col gap-6 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col">
              <label className="text-sm font-medium">Sweet Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="p-2 border rounded"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium">Price</label>
              <input
                required
                type="number"
                min={0}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="p-2 border rounded"
                placeholder="Enter price"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="p-2 border rounded bg-white"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium">Quantity</label>
              <input
                type="number"
                min={0}
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                className="p-2 border rounded"
                placeholder="Enter quantity"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 transition text-white rounded px-6 py-2 w-full sm:w-auto self-center cursor-pointer"
          >
            Add Sweet
          </button>
        </form>
      </div>

      {/* listing sweets */}
      <h2 className="text-2xl font-semibold text-center mb-6">Manage Available Sweets</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.isArray(sweets?.sweets) && sweets.sweets.length > 0 ? (sweets.sweets.map((s) => (
          <div key={s._id} className="bg-white rounded p-5 shadow">
            {editingId === s._id ? (
              // edit form
              <div className="flex flex-col gap-4 p-4 rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium">Sweet Name</label>
                    <input
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium">Price</label>
                    <input
                      type="number"
                      min={0}
                      value={editForm.price}
                      onChange={(e) =>
                        setEditForm({ ...editForm, price: Number(e.target.value) })
                      }
                      className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium ">Category</label>
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="p-2 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 justify-center mt-3">
                  <button
                    onClick={() => handleUpdate(s._id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-md transition cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-1 rounded-md transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : restockId === s._id ? (
              // restock form 
              <div className="flex flex-col gap-3 p-4 rounded-lg">
                <label className="text-sm font-medium">Add Quantity</label>
                <input
                  type="number"
                  min={1}
                  value={restockValue}
                  onChange={(e) => setRestockValue(Number(e.target.value))}
                  className="p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter amount to add"
                />
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => handleRestock(s._id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md transition cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setRestockId(null)}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-1 rounded-md transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // default display
              <div className="flex flex-col space-y-2">
                <h3 className="text-gray-600">Name: {s.name}</h3>
                <p className="text-gray-600">Price: ₹{s.price}</p>
                <p className="text-gray-600">Category: {s.category}</p>
                <p className="text-gray-600">Quantity: {s.quantity}</p>
                <div className="flex flex-wrap gap-3 justify-center pt-3">
                  <button
                    onClick={() => startEditing(s)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-1 rounded-md transition cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setRestockId(s._id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md transition cursor-pointer"
                  >
                    Restock
                  </button>
                  <button
                    onClick={() => deleteSweet(s._id)}
                    className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-1 rounded-md transition cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))) : (
          <p className="text-center text-gray-500 col-span-full">
            No sweets available.
          </p>
        )
        }
      </div>
    </div>
  );
}

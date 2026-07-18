import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function FarmerDashboard() {
  const { user, logout } = useAuth();
  const [listings, setListings] = useState([]);
  const [sales, setSales] = useState([]);
  const [form, setForm] = useState({
    cropName: "",
    quantity: "",
    unit: "kg",
    pricePerUnit: "",
    type: "ready",
    harvestDate: "",
    description: "",
  });
  const [error, setError] = useState("");

  const loadData = async () => {
    const [listingsRes, salesRes] = await Promise.all([
      api.get("/listings/my"),
      api.get("/orders/my-sales"),
    ]);
    setListings(listingsRes.data);
    setSales(salesRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/listings", form);
      setForm({
        cropName: "",
        quantity: "",
        unit: "kg",
        pricePerUnit: "",
        type: "ready",
        harvestDate: "",
        description: "",
      });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create listing");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-green-700">
          Farmer Dashboard — {user.name}
        </h1>
        <button
          onClick={logout}
          className="text-sm bg-gray-800 text-white px-3 py-1.5 rounded hover:bg-gray-900"
        >
          Log Out
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="font-semibold text-lg mb-4">List a New Crop</h2>
          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              name="cropName"
              placeholder="Crop name (e.g. Wheat)"
              required
              value={form.cropName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <div className="flex gap-3">
              <input
                name="quantity"
                type="number"
                placeholder="Quantity"
                required
                value={form.quantity}
                onChange={handleChange}
                className="w-1/2 border border-gray-300 rounded px-3 py-2"
              />
              <input
                name="unit"
                placeholder="Unit (kg)"
                value={form.unit}
                onChange={handleChange}
                className="w-1/2 border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <input
              name="pricePerUnit"
              type="number"
              placeholder="Price per unit (₹)"
              required
              value={form.pricePerUnit}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="ready">Ready to sell now</option>
              <option value="upcoming">Available for advance booking</option>
            </select>
            {form.type === "upcoming" && (
              <input
                name="harvestDate"
                type="date"
                required
                value={form.harvestDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            )}
            <textarea
              name="description"
              placeholder="Description (optional)"
              value={form.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows="2"
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded font-medium hover:bg-green-700"
            >
              Add Listing
            </button>
          </form>
        </section>
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="font-semibold text-lg mb-4">
            My Listings ({listings.length})
          </h2>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {listings.length === 0 && (
              <p className="text-gray-500 text-sm">No listings yet.</p>
            )}
            {listings.map((l) => (
              <div
                key={l._id}
                className="border border-gray-200 rounded p-3 text-sm"
              >
                <div className="flex justify-between">
                  <span className="font-medium">{l.cropName}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${l.status === "available" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}
                  >
                    {l.status}
                  </span>
                </div>
                <p className="text-gray-600">
                  {l.quantity} {l.unit} @ ₹{l.pricePerUnit} —{" "}
                  {l.type === "ready" ? "Direct sale" : "Advance booking"}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <section className="bg-white p-6 rounded-lg shadow-md mt-8">
        <h2 className="font-semibold text-lg mb-4">
          My Sales & Bookings ({sales.length})
        </h2>
        <div className="space-y-3">
          {sales.length === 0 && (
            <p className="text-gray-500 text-sm">No orders yet.</p>
          )}
          {sales.map((o) => (
            <div
              key={o._id}
              className="border border-gray-200 rounded p-3 text-sm flex justify-between items-center"
            >
              <div>
                <p className="font-medium">
                  {o.listing?.cropName} — {o.buyer?.name}
                </p>
                <p className="text-gray-600">
                  {o.orderType === "booking"
                    ? "Advance booking"
                    : "Direct sale"}{" "}
                  · ₹{o.amountDue} due of ₹{o.totalAmount}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded ${o.status === "confirmed" ? "bg-green-100 text-green-700" : o.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}
              >
                {o.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

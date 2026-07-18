import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function BuyerDashboard() {
  const { user, logout } = useAuth();
  const [listings, setListings] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [error, setError] = useState("");

  const loadData = async () => {
    const [listingsRes, purchasesRes] = await Promise.all([
      api.get("/listings"),
      api.get("/orders/my-purchases"),
    ]);
    setListings(listingsRes.data);
    setPurchases(purchasesRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);
  const handleOrder = async (listingId) => {
    setError("");
    try {
      await api.post("/orders", { listingId });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Could not place order");
    }
  };

  const handlePay = async (orderId) => {
    await api.patch(`/orders/${orderId}/pay`);
    loadData();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-green-700">
          Buyer Dashboard — {user.name}
        </h1>
        <button
          onClick={logout}
          className="text-sm bg-gray-800 text-white px-3 py-1.5 rounded hover:bg-gray-900"
        >
          Log Out
        </button>
      </div>
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      <div className="grid md:grid-cols-2 gap-8">
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="font-semibold text-lg mb-4">
            Available Crops ({listings.length})
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {listings.length === 0 && (
              <p className="text-gray-500 text-sm">Nothing listed yet.</p>
            )}

            {listings.map((l) => (
              <div
                key={l._id}
                className="border border-gray-200 rounded p-3 text-sm"
              >
                <div className="flex justify-between">
                  <span className="font-medium">{l.cropName}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                    {l.type === "ready" ? "Direct" : "Booking"}
                  </span>
                </div>
                <p className="text-gray-600">
                  {l.quantity} {l.unit} @ ₹{l.pricePerUnit} · Farmer:{" "}
                  {l.farmer?.name}
                </p>
                {l.type === "upcoming" && (
                  <p className="text-gray-500 text-xs">
                    Harvest: {new Date(l.harvestDate).toLocaleDateString()}
                  </p>
                )}
                <button
                  onClick={() => handleOrder(l._id)}
                  className="mt-2 bg-green-600 text-white text-xs px-3 py-1.5 rounded hover:bg-green-700"
                >
                  {l.type === "ready" ? "Buy Now" : "Book in Advance"}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="font-semibold text-lg mb-4">
            My Orders ({purchases.length})
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {purchases.length === 0 && (
              <p className="text-gray-500 text-sm">No orders yet.</p>
            )}
            {purchases.map((o) => (
              <div
                key={o._id}
                className="border border-gray-200 rounded p-3 text-sm"
              >
                <div className="flex justify-between">
                  <span className="font-medium">{o.listing?.cropName}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${o.status === "confirmed" ? "bg-green-100 text-green-700" : o.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}
                  >
                    {o.status}
                  </span>
                </div>
                <p className="text-gray-600">
                  {o.orderType === "booking"
                    ? "Advance booking"
                    : "Direct purchase"}{" "}
                  · ₹{o.amountDue} due of ₹{o.totalAmount}
                </p>
                {o.status === "pending_payment" && (
                  <button
                    onClick={() => handlePay(o._id)}
                    className="mt-2 bg-blue-600 text-white text-xs px-3 py-1.5 rounded hover:bg-blue-700"
                  >
                    Pay ₹{o.amountDue}
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

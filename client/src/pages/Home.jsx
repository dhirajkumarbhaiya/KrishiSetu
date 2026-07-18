import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const [status, setStatus] = useState("Checking...");
  const { user, logout } = useAuth();

  useEffect(() => {
    api
      .get("/health")
      .then((res) => setStatus(res.data.message))
      .catch(() => setStatus("Backend not reachable"));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans flex flex-col items-center justify-center">
      <h1 className="mb-4 text-3xl font-bold text-green-700">KrishiSetu</h1>
      <p className="text-gray-600 mt-2">
        Backend status: <span className="font-semibold">{status}</span>
      </p>
      {user ? (
        <div className="mt-6">
          <p className="text-gray-800">
            Logged in as <strong>{user.name}</strong>({user.role})
          </p>
          <button
            onClick={logout}
            className="mt-2 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
          >
            Log Out
          </button>
        </div>
      ) : (
        <div className="mt-6 space-x-4">
          <Link to="/login" className="text-green-700 font-medium">
            Log In
          </Link>
          <Link to="/register" className="text-green-700 font-medium">
            Register
          </Link>
        </div>
      )}
    </div>
  );
}

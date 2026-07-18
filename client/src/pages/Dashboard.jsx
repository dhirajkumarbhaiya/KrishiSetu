import { useAuth } from "../context/AuthContext";
import FarmerDashboard from "./FarmerDashboard";
import BuyerDashboard from "./BuyerDashboard";

export default function Dashboard() {
  const { user } = useAuth();
  return user.role === "farmer" ? <FarmerDashboard /> : <BuyerDashboard />;
}

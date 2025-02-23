import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const AdminRoutes = () => {
  const { user, isSignedIn } = useUser();

  // Yahan check kar raha hai ki user sign-in hai aur uska role "admin" hai ya nahi
  const isAdmin = isSignedIn && user?.publicMetadata?.role === "admin";

  return isAdmin ? <Outlet /> : <Navigate to="/sign-in" replace />;
};

export default AdminRoutes;

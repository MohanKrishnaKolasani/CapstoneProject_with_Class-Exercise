import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}>
        <div className="spinner-border" style={{ color: "#7e0404" }} role="status" />
        <span className="ms-3" style={{ color: "#7e0404" }}>Loading...</span>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;

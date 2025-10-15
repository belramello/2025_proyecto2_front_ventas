import { Navigate } from "react-router-dom";
import { useContext, type ReactNode } from "react";
import { AuthContext } from "../context/authContext";

interface ProtectedRouteProps {
  children: ReactNode;
}
//requiredRole?: string;
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const auth = useContext(AuthContext);

  if (!auth) return null;
  const { isAuth, isLoading } = auth;

  if (isLoading) return <div>Cargando...</div>;

  if (!isAuth) return <Navigate to="/login" replace />;

  /*
  // Si tiene rol requerido, se puede ampliar para verificarlo
  if (requiredRole) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.rol !== requiredRole) {
        return <Navigate to="/login" replace />;
      }
    }
  }
    */

  return children;
};

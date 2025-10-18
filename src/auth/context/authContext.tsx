import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  eliminarTokens,
  obtenerPermisos,
  obtenerToken,
} from "../../utils/storage";

// Estructura del payload del JWT
interface JwtPayload {
  exp?: number;
}

// Función para verificar si un JWT no ha expirado
const isValidJwt = (token: string | null): boolean => {
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1])) as JwtPayload;
    return payload.exp ? payload.exp * 1000 > Date.now() : false;
  } catch (error) {
    console.error("Error decodificando el JWT:", error);
    return false;
  }
};

// Estructura del contexto
export interface AuthContextType {
  isAuth: boolean;
  permisos: number[] | null;
  isLoading: boolean;
  login: (permisos: number[]) => void;
  logout: () => void;
}

// Crear contexto
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuth, setIsAuth] = useState(false);
  const [permisos, setPermisos] = useState<number[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      setIsLoading(true);
      const token = obtenerToken();
      const permisosLocales = obtenerPermisos();

      if (isValidJwt(token) && permisosLocales) {
        setIsAuth(true);
        setPermisos(permisosLocales);
      } else {
        eliminarTokens();
        setIsAuth(false);
        setPermisos(null);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = (permisos: number[]) => {
    setIsAuth(true);
    setPermisos(permisos);
  };

  const logout = () => {
    eliminarTokens();
    setIsAuth(false);
    setPermisos(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuth, permisos, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto fácilmente
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};

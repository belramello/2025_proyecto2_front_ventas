import { createContext, useState, useEffect } from 'react';
import { eliminarTokens, obtenerToken } from '../utils/storage';

// Definición de la estructura del payload del JWT
interface JwtPayload {
  exp?: number;
}

// Función para verificar si un token JWT es válido (no expirado)
const isValidJwt = ( token: string | null ): boolean => {
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1])) as JwtPayload;
    if (!payload.exp) return false;

    return payload.exp * 1000 > Date.now();
  } catch(error) {
    console.error('Error decodificando el token JWT:', error);
  }
  return false;
}

export interface AuthContextType {
  isAuth: boolean;
  nombre: string | null;
  isLoading: boolean;
  login: (newNombre: string) => void;
  logout: () => void;
}

// Creación del contexto de autenticación
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}): {children: React.ReactNode} => {
  const [isAuth, setIsAuth] = useState(false);
  const [nombre, setNombre] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      setIsLoading(true);
      const token = obtenerToken();
      const storedNombre = localStorage.getItem('nombre');

      if (isValidJwt(token) && storedNombre) {
        setIsAuth(true);
        setNombre(storedNombre);
      } else {
        eliminarTokens();
        setIsAuth(false);
        setNombre(null);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = (newNombre: string) => {
    setIsAuth(true);
    setNombre(newNombre);
  };

  const logout = () => {
    eliminarTokens();
    setIsAuth(false);
    setNombre(null);
  };

  return (
    <AuthContext.Provider value={{ isAuth, nombre, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

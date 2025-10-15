// Utilidades para manejar tokens en localStorage

// Función para guardar tokens en localStorage
export const guardarToken = (
  accesToken: string,
  refreshToken: string | null,
  nombre?: string,
) => {
  try {
    localStorage.setItem('accessToken', accesToken);
    if (refreshToken !== null) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    if (nombre) {
      localStorage.setItem('nombre', nombre);
    }
  } catch (error) {
    console.error('Error guardando tokens en localStorage:', error);
  }
};

// Función para obtener el token de acceso desde localStorage
export const obtenerToken = (): string | null => {
  try {
    return localStorage.getItem('accessToken');
  } catch (error) {
    console.error('Error obteniendo el token de localStorage:', error);
    return null;
  }
};

// Función para obtener el refresh token desde localStorage
export const obtenerRefreshToken = (): string | null => {
  try {
    return localStorage.getItem('refreshToken');
  } catch (error) {
    console.error('Error obteniendo el refresh token de localStorage:', error);
    return null;
  }
};

// Función para eliminar tokens de localStorage
export const eliminarTokens = (): void => {
  try {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('nombre');
  } catch (error) {
    console.error('Error eliminando tokens de localStorage:', error);
  }
};
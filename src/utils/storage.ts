// Función para guardar tokens en localStorage
export const guardarToken = (
  accesToken: string,
  refreshToken: string | null,
  permisos?: number[]
) => {
  try {
    localStorage.setItem("accessToken", accesToken);
    if (refreshToken !== null) {
      localStorage.setItem("refreshToken", refreshToken);
    }
    if (permisos) {
      localStorage.setItem("permisos", JSON.stringify(permisos));
    }
  } catch (error) {
    console.error("Error guardando tokens en localStorage:", error);
  }
};

// Función para obtener el token de acceso desde localStorage
export const obtenerToken = (): string | null => {
  try {
    return localStorage.getItem("accessToken");
  } catch (error) {
    console.error("Error obteniendo el token de localStorage:", error);
    return null;
  }
};

export const obtenerPermisos = (): number[] | null => {
  try {
    const raw = localStorage.getItem("permisos");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every((v) => typeof v === "number")) {
      return parsed as number[];
    }
    return null;
  } catch (error) {
    console.error("Error obteniendo los permisos de localStorage:", error);
    return null;
  }
};

// Función para obtener el refresh token desde localStorage
export const obtenerRefreshToken = (): string | null => {
  try {
    return localStorage.getItem("refreshToken");
  } catch (error) {
    console.error("Error obteniendo el refresh token de localStorage:", error);
    return null;
  }
};

// Función para eliminar tokens de localStorage
export const eliminarTokens = (): void => {
  try {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("permisos");
  } catch (error) {
    console.error("Error eliminando tokens de localStorage:", error);
  }
};

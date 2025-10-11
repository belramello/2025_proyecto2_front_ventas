export const guardarToken = (
  accessToken: string,
  refreshToken: string | null
) => {
  try {
    localStorage.setItem("accessToken", accessToken);
    if (refreshToken !== null) {
      localStorage.setItem("refreshToken", refreshToken);
    }
  } catch (error) {
    console.error("Error al guardar tokens:", error);
  }
};

export const obtenerToken = (): string | null => {
  try {
    return localStorage.getItem("accessToken");
  } catch (error) {
    console.error("Error al obtener accessToken:", error);
    return null;
  }
};

export const obtenerRefreshToken = (): string | null => {
  try {
    return localStorage.getItem("refreshToken");
  } catch (error) {
    console.error("Error al obtener refreshToken:", error);
    return null;
  }
};

export const eliminarTokens = (): void => {
  try {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("nombreUsuario");
  } catch (error) {
    console.error("Error al eliminar tokens:", error);
  }
};

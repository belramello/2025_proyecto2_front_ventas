import api from "../utils/api";

export const getDashboardUrl = async () => {
  try {
    const { data } = await api.get<{ signedUrl: string }>("/metabase");
    return data;
  } catch (error: any) {
    throw new Error(
      "Error al obtener el dashboard. Verifica tu sesión o con el equipo de backend."
    );
  }
};

export const formatFecha = (input: string | Date): string => {
  const fecha = typeof input === "string" ? new Date(input) : input;

  // Formateo fijo en zona horaria Argentina
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "America/Argentina/Cordoba",
  }).format(fecha);
};

export const formatHora = (input: string | Date): string => {
  const fecha = typeof input === "string" ? new Date(input) : input;

  return new Intl.DateTimeFormat("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Argentina/Cordoba",
  }).format(fecha);
};

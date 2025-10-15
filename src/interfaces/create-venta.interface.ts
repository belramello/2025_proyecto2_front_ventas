export interface CreateVentaDto {
  detalles: { productoId: number; cantidad: number }[];
  medioDePago: "efectivo" | "credito" | "debito";
}

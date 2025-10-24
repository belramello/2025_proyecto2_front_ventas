export interface Historial {
  id: number;
  usuario: number;
  fechaHora: string;
  accion: {
    id: number;
    nombre: string;
  };
  estado: {
    id: number;
    nombre: string;
  };
}
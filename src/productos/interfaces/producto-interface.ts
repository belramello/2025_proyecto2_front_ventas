//actualizar estos son por el momento los que yo necesito pero agreguen
export interface Producto {
  id: number;
  codigo: string;
  marca: {
        id:number,
        nombre:string,
        descripcion:string,
        logoUrl: string | null
      },
      linea: {
        id: number,
        nombre: string,
      },
  nombre: string;
  precio: number;
  stock: number;
  fotoUrl: string | null;
  descripcion: string;
}

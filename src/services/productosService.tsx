import type { CreateProductoDto } from "../productos/interfaces/Create-producto.dto";
import type { Producto } from "../productos/interfaces/producto-interface";
import type { ProductosPaginatedResponse } from "../productos/interfaces/productos-paginated-response.interface";
import type { UpdateProductoDto } from "../productos/interfaces/Update-producto.dto";
import api from "../utils/api";

export const ProductosService = {
  async getProductos(page: number = 1): Promise<ProductosPaginatedResponse> {
    try {
      const { data } = await api.get<ProductosPaginatedResponse>(
        `/productos?page=${page}`
      );
      return data;
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      throw error;
    }
  },

  async obtenerProductoPorId(id: number): Promise<Producto> {
    try {
      const { data } = await api.get<Producto>(`/productos/${id}`);
      return data;
    } catch (error) {
      console.error("Error al obtener producto por ID:", error);
      throw error;
    }
  },

  async obtenerProductoPorCodigo(codigo: string): Promise<Producto> {
    try {
      const { data } = await api.get<Producto>(`/productos/codigo/${codigo}`);
      return data;
    } catch (error) {
      console.error("Error al obtener producto por código:", error);
      throw error;
    }
  },

  async crearProducto(productoData: CreateProductoDto): Promise<Producto> {
    try {
      const formData = new FormData();

      formData.append("nombre", productoData.nombre);
      formData.append("descripcion", productoData.descripcion);
      formData.append("precio", productoData.precio.toString());
      formData.append("codigo", productoData.codigo || "");
      formData.append("marcaId", productoData.marcaId.toString());
      formData.append("lineaId", productoData.lineaId.toString());
      formData.append("stock", productoData.stock.toString());

      if (productoData.detalleProveedores?.length > 0) {
        formData.append(
          "detalleProveedores",
          JSON.stringify(productoData.detalleProveedores)
        );
      }

      if (productoData.imagen) {
        formData.append("imagen", productoData.imagen);
      }
      console.log("formData", formData);

      const { data } = await api.post<Producto>("/productos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return data;
    } catch (error) {
      console.error("Error al crear producto:", error);
      throw error;
    }
  },

  async actualizarProducto(
    id: number,
    updateData: UpdateProductoDto
  ): Promise<Producto> {
    try {
      const formData = new FormData();

      // Ajusta esto según los campos que permitas actualizar
      if (updateData.nombre) formData.append("nombre", updateData.nombre);
      if (updateData.descripcion)
        formData.append("descripcion", updateData.descripcion);
      if (updateData.precio)
        formData.append("precio", updateData.precio.toString());
      if (updateData.codigo) formData.append("codigo", updateData.codigo);
      if (updateData.stock)
        // <-- AÑADIDO
        formData.append("stock", updateData.stock.toString());
      if (updateData.marcaId)
        // <-- AÑADIDO
        formData.append("marcaId", updateData.marcaId.toString());
      if (updateData.lineaId)
        // <-- AÑADIDO
        formData.append("lineaId", updateData.lineaId.toString());
      if (updateData.imagen) formData.append("imagen", updateData.imagen);

      const { data } = await api.patch<Producto>(`/productos/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      throw error;
    }
  },

  async eliminarProducto(id: number): Promise<void> {
    try {
      await api.delete(`/productos/${id}`);
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      throw error;
    }
  },
};

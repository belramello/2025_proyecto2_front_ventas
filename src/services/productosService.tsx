import type { CreateProductoDto } from "../productos/interfaces/Create-producto.dto";
import type { Producto } from "../productos/interfaces/producto-interface";
import type { ProductosPaginatedResponse } from "../productos/interfaces/productos-paginated-response.interface";
import type { UpdateProductoDto } from "../productos/interfaces/Update-producto.dto";
import api from "../utils/api";

export const ProductosService = {
  // ... (getProductos, obtenerProductoPorId, etc. sin cambios)
  async getProductos(page: number = 1): Promise<ProductosPaginatedResponse> {
    try {
      const { data } = await api.get<ProductosPaginatedResponse>(
        `/productos/?page=${page}`
      );
      return data;
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      throw error;
    }
  },

  async obtenerProductoPorId(id: number): Promise<Producto> {
    try {
      const { data } = await api.get<Producto>(`/productos/${id}/`);
      return data;
    } catch (error) {
      console.error("Error al obtener producto por ID:", error);
      throw error;
    }
  },

  async obtenerProductoPorCodigo(codigo: string): Promise<Producto> {
    try {
      const { data } = await api.get<Producto>(`/productos/codigo/${codigo}/`);
      return data;
    } catch (error) {
      console.error("Error al obtener producto por código:", error);
      throw error;
    }
  },

  async crearProducto(productoData: CreateProductoDto): Promise<Producto> {
    try {
      // Validar los datos antes de enviarlos
      if (!productoData.nombre || typeof productoData.nombre !== "string") {
        throw new Error("El nombre debe ser un string no vacío");
      }
      if (
        !productoData.descripcion ||
        typeof productoData.descripcion !== "string"
      ) {
        throw new Error("La descripción debe ser un string no vacío");
      }
      if (
        typeof productoData.precio !== "number" ||
        productoData.precio < 0 ||
        isNaN(productoData.precio)
      ) {
        throw new Error("El precio debe ser un número mayor o igual a 0");
      }
      if (!productoData.codigo || typeof productoData.codigo !== "string") {
        throw new Error("El código debe ser un string no vacío");
      }
      if (
        typeof productoData.marcaId !== "number" ||
        !Number.isInteger(productoData.marcaId) ||
        productoData.marcaId < 1
      ) {
        throw new Error(
          "El marcaId debe ser un número entero mayor o igual a 1"
        );
      }
      if (
        typeof productoData.lineaId !== "number" ||
        !Number.isInteger(productoData.lineaId) ||
        productoData.lineaId < 1
      ) {
        throw new Error(
          "El lineaId debe ser un número entero mayor o igual a 1"
        );
      }
      if (
        typeof productoData.stock !== "number" ||
        !Number.isInteger(productoData.stock) ||
        productoData.stock < 0
      ) {
        throw new Error("El stock debe ser un número entero mayor o igual a 0");
      }
      if (
        !Array.isArray(productoData.detalleProveedores) ||
        productoData.detalleProveedores.length === 0
      ) {
        throw new Error("detalleProveedores debe ser un array no vacío");
      }
      productoData.detalleProveedores.forEach((detalle, index) => {
        if (
          typeof detalle.proveedorId !== "number" ||
          !Number.isInteger(detalle.proveedorId) ||
          detalle.proveedorId < 1
        ) {
          throw new Error(
            `detalleProveedores[${index}].proveedorId debe ser un número entero mayor o igual a 1`
          );
        }
        if (!detalle.codigo || typeof detalle.codigo !== "string") {
          throw new Error(
            `detalleProveedores[${index}].codigo debe ser un string no vacío`
          );
        }
      });

      const formData = new FormData();

      // Añadir los campos al FormData
      formData.append("nombre", productoData.nombre);
      formData.append("descripcion", productoData.descripcion);
      formData.append("precio", productoData.precio.toString());
      formData.append("codigo", productoData.codigo);
      formData.append("marcaId", productoData.marcaId.toString());
      formData.append("lineaId", productoData.lineaId.toString());
      formData.append("stock", productoData.stock.toString());

      // Enviar detalleProveedores como un string JSON
      console.log(
        "detalleProveedores:",
        JSON.stringify(productoData.detalleProveedores, null, 2)
      );
      formData.append(
        "detalleProveedores",
        JSON.stringify(productoData.detalleProveedores)
      );

      if (productoData.imagen) {
        formData.append("imagen", productoData.imagen);
      }

      // Depurar el contenido de FormData
      for (const [key, value] of formData.entries()) {
        console.log(`FormData - ${key}: ${value}`);
      }

      const { data } = await api.post<Producto>("/productos/", formData, {
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

      if (updateData.nombre) formData.append("nombre", updateData.nombre);
      if (updateData.descripcion)
        formData.append("descripcion", updateData.descripcion);
      if (updateData.precio)
        formData.append("precio", updateData.precio.toString());
      if (updateData.codigo) formData.append("codigo", updateData.codigo);
      if (updateData.stock)
        formData.append("stock", updateData.stock.toString());
      if (updateData.marcaId)
        formData.append("marcaId", updateData.marcaId.toString());
      if (updateData.lineaId)
        formData.append("lineaId", updateData.lineaId.toString());
      if (updateData.imagen) formData.append("imagen", updateData.imagen);

      // (Asumiendo que también puedes actualizar proveedores en el update)
      if (updateData.detalleProveedores) {
        // APLICAMOS LA MISMA LÓGICA DE JSON.STRINGIFY AQUÍ
        formData.append(
          "detalleProveedores",
          JSON.stringify(updateData.detalleProveedores)
        );
      }

      const { data } = await api.patch<Producto>(
        `/productos/${id}/`,
        formData,
        {
          headers: { "Content-Type": "multipart-form-data" },
        }
      );
      return data;
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      throw error;
    }
  },

  async eliminarProducto(id: number): Promise<void> {
    try {
      await api.delete(`/productos/${id}/`);
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      throw error;
    }
  },
};

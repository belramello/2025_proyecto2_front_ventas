import type { ProveedorPaginatedResponse } from "../proveedores/interfaces/proveedores-paginated-response.interface";
import api from "../utils/api";
import type { CreateProveedor } from "../proveedores/interfaces/create-proveedor.interface";

export const ProveedoresService = {
    async getProveedor(page: number = 1): Promise<ProveedorPaginatedResponse> {
        try {
        const { data } = await api.get<ProveedorPaginatedResponse>(
            `/proveedores?page=${page}`
        );
        return data;
        } catch (error) {
        console.error("Error al obtener los proveedores:", error);
        throw error;
        }
    },

    async registrarProveedor(createProveedor: CreateProveedor): Promise<void> {
        try {
            console.log("createProveedorDto", createProveedor);
            await api.post(`/proveedores`, createProveedor);
            return;
            } catch (error) {
            console.error("Error al registrar proveedor:", error);
            throw error;
        }
    },
    async eliminarProveedorPorId(id: number): Promise<void> {
        try {
            await api.delete(`/proveedores/${id}`);
        } catch (error) {
            console.error(`Error al eliminar el proveedor con ID ${id}:`, error);
            throw error;
        }
    },
};

import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3002';

export class BackendService {
    // Productos
    async listarProductos() {
        const response = await axios.get(`${BACKEND_URL}/productos`);
        return response.data;
    }

    async buscarProducto(id: string) {
        const response = await axios.get(`${BACKEND_URL}/productos/${id}`);
        return response.data;
    }

    async buscarProductosPorNombre(nombre: string) {
        const response = await axios.get(`${BACKEND_URL}/productos`, {
            params: { nombre },
        });
        return response.data;
    }

    async crearProducto(data: any) {
        const response = await axios.post(`${BACKEND_URL}/productos`, data);
        return response.data;
    }

    async actualizarProducto(id: string, data: any) {
        const response = await axios.put(`${BACKEND_URL}/productos/${id}`, data);
        return response.data;
    }

    async eliminarProducto(id: string) {
        const response = await axios.delete(`${BACKEND_URL}/productos/${id}`);
        return response.data;
    }

    // Órdenes
    async listarOrdenes() {
        const response = await axios.get(`${BACKEND_URL}/ordenes`);
        return response.data;
    }

    async buscarOrden(id: string) {
        const response = await axios.get(`${BACKEND_URL}/ordenes/${id}`);
        return response.data;
    }

    async crearOrden(data: any) {
        const response = await axios.post(`${BACKEND_URL}/ordenes`, data);
        return response.data;
    }

    async actualizarOrden(id: string, data: any) {
        const response = await axios.put(`${BACKEND_URL}/ordenes/${id}`, data);
        return response.data;
    }

    async eliminarOrden(id: string) {
        const response = await axios.delete(`${BACKEND_URL}/ordenes/${id}`);
        return response.data;
    }
}

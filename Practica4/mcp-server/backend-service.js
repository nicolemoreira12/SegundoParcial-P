"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackendService = void 0;
const axios_1 = __importDefault(require("axios"));
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3002';
class BackendService {
    // Productos
    async listarProductos() {
        const response = await axios_1.default.get(`${BACKEND_URL}/productos`);
        return response.data;
    }
    async buscarProducto(id) {
        const response = await axios_1.default.get(`${BACKEND_URL}/productos/${id}`);
        return response.data;
    }
    async buscarProductosPorNombre(nombre) {
        const response = await axios_1.default.get(`${BACKEND_URL}/productos`, {
            params: { nombre },
        });
        return response.data;
    }
    async crearProducto(data) {
        const response = await axios_1.default.post(`${BACKEND_URL}/productos`, data);
        return response.data;
    }
    async actualizarProducto(id, data) {
        const response = await axios_1.default.put(`${BACKEND_URL}/productos/${id}`, data);
        return response.data;
    }
    async eliminarProducto(id) {
        const response = await axios_1.default.delete(`${BACKEND_URL}/productos/${id}`);
        return response.data;
    }
    // Órdenes
    async listarOrdenes() {
        const response = await axios_1.default.get(`${BACKEND_URL}/ordenes`);
        return response.data;
    }
    async buscarOrden(id) {
        const response = await axios_1.default.get(`${BACKEND_URL}/ordenes/${id}`);
        return response.data;
    }
    async crearOrden(data) {
        const response = await axios_1.default.post(`${BACKEND_URL}/ordenes`, data);
        return response.data;
    }
    async actualizarOrden(id, data) {
        const response = await axios_1.default.put(`${BACKEND_URL}/ordenes/${id}`, data);
        return response.data;
    }
    async eliminarOrden(id) {
        const response = await axios_1.default.delete(`${BACKEND_URL}/ordenes/${id}`);
        return response.data;
    }
}
exports.BackendService = BackendService;
//# sourceMappingURL=backend-service.js.map
export declare class BackendService {
    listarProductos(): Promise<any>;
    buscarProducto(id: string): Promise<any>;
    buscarProductosPorNombre(nombre: string): Promise<any>;
    crearProducto(data: any): Promise<any>;
    actualizarProducto(id: string, data: any): Promise<any>;
    eliminarProducto(id: string): Promise<any>;
    listarOrdenes(): Promise<any>;
    buscarOrden(id: string): Promise<any>;
    crearOrden(data: any): Promise<any>;
    actualizarOrden(id: string, data: any): Promise<any>;
    eliminarOrden(id: string): Promise<any>;
}
//# sourceMappingURL=backend-service.d.ts.map
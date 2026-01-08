import { JsonRpcRequest, JsonRpcResponse, ToolCallParams } from './types';
import { TOOLS } from './tools';
import { BackendService } from './backend-service';

const backendService = new BackendService();

// Manejar solicitud JSON-RPC 2.0
export async function handleJsonRpcRequest(request: JsonRpcRequest): Promise<JsonRpcResponse> {
    const { jsonrpc, method, params, id } = request;

    // Validar JSON-RPC 2.0
    if (jsonrpc !== '2.0') {
        return {
            jsonrpc: '2.0',
            error: {
                code: -32600,
                message: 'Invalid Request',
                data: 'jsonrpc must be "2.0"',
            },
            id: id || null,
        };
    }

    try {
        let result: any;

        switch (method) {
            case 'tools/list':
                // Listar todos los Tools disponibles
                result = { tools: TOOLS };
                break;

            case 'tools/call':
                // Ejecutar un Tool específico
                result = await executeToolCall(params as ToolCallParams);
                break;

            default:
                return {
                    jsonrpc: '2.0',
                    error: {
                        code: -32601,
                        message: 'Method not found',
                        data: `Method "${method}" not supported`,
                    },
                    id,
                };
        }

        return {
            jsonrpc: '2.0',
            result,
            id,
        };
    } catch (error: any) {
        console.error('Error executing JSON-RPC method:', error);

        return {
            jsonrpc: '2.0',
            error: {
                code: -32603,
                message: 'Internal error',
                data: error.message || 'Unknown error',
            },
            id,
        };
    }
}

// Ejecutar llamada a Tool
async function executeToolCall(params: ToolCallParams): Promise<any> {
    const { name, arguments: args } = params;

    // Verificar que el Tool existe
    const tool = TOOLS.find((t) => t.name === name);
    if (!tool) {
        throw new Error(`Tool "${name}" not found`);
    }

    // Validar parámetros requeridos
    if (tool.inputSchema.required) {
        for (const requiredParam of tool.inputSchema.required) {
            if (!(requiredParam in args)) {
                throw new Error(`Missing required parameter: ${requiredParam}`);
            }
        }
    }

    // Ejecutar Tool según el nombre
    switch (name) {
        // ========== PRODUCTOS ==========
        case 'listar_productos':
            return await backendService.listarProductos();

        case 'buscar_producto':
            return await backendService.buscarProducto(args.id);

        case 'buscar_productos_por_nombre':
            return await backendService.buscarProductosPorNombre(args.nombre);

        case 'crear_producto':
            return await backendService.crearProducto({
                nombreProducto: args.nombreProducto,
                descripcion: args.descripcion,
                precio: args.precio,
                stock: args.stock,
                imagenURL: args.imagenURL,
                idCategoria: args.idCategoria,
            });

        case 'actualizar_producto':
            const { id: productoId, ...productoData } = args;
            return await backendService.actualizarProducto(productoId, productoData);

        case 'eliminar_producto':
            return await backendService.eliminarProducto(args.id);

        // ========== ÓRDENES ==========
        case 'listar_ordenes':
            return await backendService.listarOrdenes();

        case 'buscar_orden':
            return await backendService.buscarOrden(args.id);

        case 'crear_orden':
            return await backendService.crearOrden({
                idProducto: args.idProducto,
                cantidad: args.cantidad,
                nombreCliente: args.nombreCliente,
                emailCliente: args.emailCliente,
            });

        case 'actualizar_estado_orden':
            const { id: ordenId, estado } = args;
            return await backendService.actualizarOrden(ordenId, { estado });

        default:
            throw new Error(`Tool "${name}" not implemented`);
    }
}

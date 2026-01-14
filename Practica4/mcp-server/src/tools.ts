import { Tool } from './types';

export const TOOLS: Tool[] = [
    {
        name: 'listar_productos',
        description: 'Obtiene la lista completa de productos disponibles en el catálogo. No requiere parámetros.',
        inputSchema: {
            type: 'object',
            properties: {},
            required: [],
        },
    },
    {
        name: 'buscar_producto',
        description: 'Busca un producto específico por su ID único. Retorna los detalles completos del producto incluyendo nombre, precio, stock y descripción.',
        inputSchema: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    description: 'ID único del producto (formato UUID)',
                },
            },
            required: ['id'],
        },
    },
    {
        name: 'buscar_productos_por_nombre',
        description: 'Busca productos cuyo nombre contenga el texto especificado. Útil para búsquedas parciales.',
        inputSchema: {
            type: 'object',
            properties: {
                nombre: {
                    type: 'string',
                    description: 'Texto a buscar en el nombre del producto',
                },
            },
            required: ['nombre'],
        },
    },
    {
        name: 'crear_producto',
        description: 'Crea un nuevo producto en el catálogo. Requiere nombre, precio y stock mínimo. La descripción es opcional.',
        inputSchema: {
            type: 'object',
            properties: {
                nombreProducto: {
                    type: 'string',
                    description: 'Nombre del producto',
                },
                descripcion: {
                    type: 'string',
                    description: 'Descripción detallada del producto (opcional)',
                },
                precio: {
                    type: 'number',
                    description: 'Precio del producto en dólares',
                    minimum: 0,
                },
                stock: {
                    type: 'number',
                    description: 'Cantidad de unidades disponibles',
                    minimum: 0,
                },
                imagenURL: {
                    type: 'string',
                    description: 'URL de la imagen del producto (opcional)',
                },
                idCategoria: {
                    type: 'number',
                    description: 'ID de la categoría del producto (opcional)',
                },
            },
            required: ['nombreProducto', 'precio', 'stock'],
        },
    },
    {
        name: 'actualizar_producto',
        description: 'Actualiza la información de un producto existente. Solo se modifican los campos proporcionados.',
        inputSchema: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    description: 'ID del producto a actualizar',
                },
                nombreProducto: {
                    type: 'string',
                    description: 'Nuevo nombre del producto (opcional)',
                },
                descripcion: {
                    type: 'string',
                    description: 'Nueva descripción (opcional)',
                },
                precio: {
                    type: 'number',
                    description: 'Nuevo precio (opcional)',
                    minimum: 0,
                },
                stock: {
                    type: 'number',
                    description: 'Nuevo stock (opcional)',
                    minimum: 0,
                },
            },
            required: ['id'],
        },
    },
    {
        name: 'eliminar_producto',
        description: 'Elimina permanentemente un producto del catálogo. Esta acción no se puede deshacer.',
        inputSchema: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    description: 'ID del producto a eliminar',
                },
            },
            required: ['id'],
        },
    },
    {
        name: 'listar_ordenes',
        description: 'Obtiene la lista completa de órdenes de compra realizadas, ordenadas por fecha descendente.',
        inputSchema: {
            type: 'object',
            properties: {},
            required: [],
        },
    },
    {
        name: 'buscar_orden',
        description: 'Busca una orden específica por su ID. Retorna los detalles completos incluyendo producto, cantidad, total y estado.',
        inputSchema: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    description: 'ID único de la orden (formato UUID)',
                },
            },
            required: ['id'],
        },
    },
    {
        name: 'crear_orden',
        description: 'Crea una nueva orden de compra. Verifica stock disponible y calcula el total automáticamente. Reduce el stock del producto.',
        inputSchema: {
            type: 'object',
            properties: {
                idProducto: {
                    type: 'string',
                    description: 'ID del producto a ordenar',
                },
                cantidad: {
                    type: 'number',
                    description: 'Cantidad de unidades a ordenar',
                    minimum: 1,
                },
                nombreCliente: {
                    type: 'string',
                    description: 'Nombre del cliente (opcional)',
                },
                emailCliente: {
                    type: 'string',
                    description: 'Email del cliente (opcional)',
                },
            },
            required: ['idProducto', 'cantidad'],
        },
    },
    {
        name: 'actualizar_estado_orden',
        description: 'Actualiza el estado de una orden existente. Estados válidos: PENDING, COMPLETED, CANCELLED.',
        inputSchema: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    description: 'ID de la orden a actualizar',
                },
                estado: {
                    type: 'string',
                    description: 'Nuevo estado de la orden',
                    enum: ['PENDING', 'COMPLETED', 'CANCELLED'],
                },
            },
            required: ['id', 'estado'],
        },
    },
];

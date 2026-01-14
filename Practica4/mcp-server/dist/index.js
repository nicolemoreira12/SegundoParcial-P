"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonrpc_handler_1 = require("./jsonrpc-handler");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Logger middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'MCP Server', timestamp: new Date().toISOString() });
});
// JSON-RPC 2.0 endpoint
app.post('/jsonrpc', async (req, res) => {
    try {
        const result = await (0, jsonrpc_handler_1.handleJsonRpcRequest)(req.body);
        res.json(result);
    }
    catch (error) {
        console.error('Error handling JSON-RPC request:', error);
        res.status(500).json({
            jsonrpc: '2.0',
            error: {
                code: -32603,
                message: 'Internal error',
                data: error.message,
            },
            id: req.body.id || null,
        });
    }
});
// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🔧 MCP Server corriendo en http://localhost:${PORT}`);
    console.log(`📡 Backend URL: ${process.env.BACKEND_URL}`);
    console.log(`🎯 Endpoint JSON-RPC: http://localhost:${PORT}/jsonrpc`);
});
//# sourceMappingURL=index.js.map
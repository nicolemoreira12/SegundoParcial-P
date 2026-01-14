import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { handleJsonRpcRequest } from './jsonrpc-handler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'MCP Server', timestamp: new Date().toISOString() });
});

// JSON-RPC 2.0 endpoint
app.post('/jsonrpc', async (req: Request, res: Response) => {
    try {
        const result = await handleJsonRpcRequest(req.body);
        res.json(result);
    } catch (error: any) {
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

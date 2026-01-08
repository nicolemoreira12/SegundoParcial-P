// JSON-RPC 2.0 Types
export interface JsonRpcRequest {
    jsonrpc: '2.0';
    method: string;
    params?: any;
    id: string | number | null;
}

export interface JsonRpcResponse {
    jsonrpc: '2.0';
    result?: any;
    error?: JsonRpcError;
    id: string | number | null;
}

export interface JsonRpcError {
    code: number;
    message: string;
    data?: any;
}

// Tool Types
export interface Tool {
    name: string;
    description: string;
    inputSchema: {
        type: 'object';
        properties: Record<string, any>;
        required?: string[];
    };
}

// Tool Call Request
export interface ToolCallParams {
    name: string;
    arguments: Record<string, any>;
}

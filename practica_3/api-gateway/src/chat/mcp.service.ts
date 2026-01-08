import { Injectable } from '@nestjs/common';
import axios from 'axios';

interface Tool {
    name: string;
    description: string;
    inputSchema: any;
}

interface ToolCallResult {
    name: string;
    arguments: any;
    result: any;
}

@Injectable()
export class McpService {
    private readonly mcpServerUrl: string;

    constructor() {
        this.mcpServerUrl = process.env.MCP_SERVER_URL || 'http://localhost:3001';
    }

    // Obtener lista de Tools disponibles
    async getTools(): Promise<Tool[]> {
        try {
            const response = await axios.post(`${this.mcpServerUrl}/jsonrpc`, {
                jsonrpc: '2.0',
                method: 'tools/list',
                params: {},
                id: 1,
            });

            if (response.data.error) {
                throw new Error(`MCP Error: ${response.data.error.message}`);
            }

            return response.data.result.tools;
        } catch (error: any) {
            console.error('Error obteniendo Tools del MCP Server:', error.message);
            throw new Error(`No se pudo conectar con MCP Server: ${error.message}`);
        }
    }

    // Ejecutar un Tool específico
    async executeToolCall(toolName: string, args: any): Promise<any> {
        try {
            console.log(`📞 Ejecutando Tool: ${toolName}`, args);

            const response = await axios.post(`${this.mcpServerUrl}/jsonrpc`, {
                jsonrpc: '2.0',
                method: 'tools/call',
                params: {
                    name: toolName,
                    arguments: args,
                },
                id: Date.now(),
            });

            if (response.data.error) {
                throw new Error(`Tool Error: ${response.data.error.message}`);
            }

            console.log(`✅ Tool ejecutado exitosamente: ${toolName}`);
            return response.data.result;
        } catch (error: any) {
            console.error(`❌ Error ejecutando Tool ${toolName}:`, error.message);
            throw error;
        }
    }

    // Ejecutar múltiples Tools en secuencia
    async executeMultipleTools(toolCalls: Array<{ name: string; args: any }>): Promise<ToolCallResult[]> {
        const results: ToolCallResult[] = [];

        for (const toolCall of toolCalls) {
            try {
                const result = await this.executeToolCall(toolCall.name, toolCall.args);
                results.push({
                    name: toolCall.name,
                    arguments: toolCall.args,
                    result,
                });
            } catch (error: any) {
                results.push({
                    name: toolCall.name,
                    arguments: toolCall.args,
                    result: { error: error.message },
                });
            }
        }

        return results;
    }
}

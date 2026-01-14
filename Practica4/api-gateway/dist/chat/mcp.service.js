"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.McpService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
let McpService = class McpService {
    constructor() {
        this.mcpServerUrl = process.env.MCP_SERVER_URL || 'http://localhost:3001';
    }
    async getTools() {
        try {
            const response = await axios_1.default.post(`${this.mcpServerUrl}/jsonrpc`, {
                jsonrpc: '2.0',
                method: 'tools/list',
                params: {},
                id: 1,
            });
            if (response.data.error) {
                throw new Error(`MCP Error: ${response.data.error.message}`);
            }
            return response.data.result.tools;
        }
        catch (error) {
            console.error('Error obteniendo Tools del MCP Server:', error.message);
            throw new Error(`No se pudo conectar con MCP Server: ${error.message}`);
        }
    }
    async executeToolCall(toolName, args) {
        try {
            console.log(`📞 Ejecutando Tool: ${toolName}`, args);
            const response = await axios_1.default.post(`${this.mcpServerUrl}/jsonrpc`, {
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
        }
        catch (error) {
            console.error(`❌ Error ejecutando Tool ${toolName}:`, error.message);
            throw error;
        }
    }
    async executeMultipleTools(toolCalls) {
        const results = [];
        for (const toolCall of toolCalls) {
            try {
                const result = await this.executeToolCall(toolCall.name, toolCall.args);
                results.push({
                    name: toolCall.name,
                    arguments: toolCall.args,
                    result,
                });
            }
            catch (error) {
                results.push({
                    name: toolCall.name,
                    arguments: toolCall.args,
                    result: { error: error.message },
                });
            }
        }
        return results;
    }
};
exports.McpService = McpService;
exports.McpService = McpService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], McpService);
//# sourceMappingURL=mcp.service.js.map
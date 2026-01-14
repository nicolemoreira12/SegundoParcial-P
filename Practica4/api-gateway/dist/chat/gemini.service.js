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
var GeminiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiService = void 0;
const common_1 = require("@nestjs/common");
const generative_ai_1 = require("@google/generative-ai");
const mcp_service_1 = require("./mcp.service");
let GeminiService = GeminiService_1 = class GeminiService {
    constructor(mcpService) {
        this.mcpService = mcpService;
        this.logger = new common_1.Logger(GeminiService_1.name);
        this.apiKey = process.env.GEMINI_API_KEY;
        if (!this.apiKey) {
            throw new Error('GEMINI_API_KEY no está configurada. Por favor, configura la variable de entorno.');
        }
        this.genAI = new generative_ai_1.GoogleGenerativeAI(this.apiKey);
        this.logger.log('✅ Gemini AI inicializado correctamente');
    }
    onModuleInit() {
        this.logger.log('Gemini Service listo para usar');
    }
    createModelWithTools(tools) {
        try {
            this.logger.log(`Creando modelo con ${tools.length} tools`);
            const geminiTools = tools.map((tool) => ({
                name: tool.name,
                description: tool.description,
                parameters: tool.inputSchema,
            }));
            const model = this.genAI.getGenerativeModel({
                model: 'gemini-2.5-flash',
                generationConfig: {
                    temperature: 0,
                    topP: 0.95,
                    maxOutputTokens: 2048,
                },
                toolConfig: {
                    functionCallingConfig: {
                        mode: generative_ai_1.FunctionCallingMode.ANY,
                    },
                },
                tools: [
                    {
                        functionDeclarations: geminiTools,
                    },
                ],
            });
            this.logger.log('✅ Modelo creado con tools');
            return model;
        }
        catch (error) {
            this.logger.error(`Error creando modelo: ${error.message}`);
            throw error;
        }
    }
    createExtractionModel() {
        try {
            this.logger.log('Creando modelo de extracción (sin tools)');
            const model = this.genAI.getGenerativeModel({
                model: 'gemini-2.5-flash',
                generationConfig: {
                    temperature: 0,
                    topP: 0.95,
                    maxOutputTokens: 2048,
                },
            });
            this.logger.log('✅ Modelo de extracción creado');
            return model;
        }
        catch (error) {
            this.logger.error(`Error creando modelo de extracción: ${error.message}`);
            throw error;
        }
    }
    async generateContent(model, parts) {
        try {
            this.logger.log('Generando contenido con Gemini...');
            const result = await model.generateContent({
                contents: [{ role: 'user', parts }],
            });
            this.logger.log('✅ Contenido generado');
            return result;
        }
        catch (error) {
            this.logger.error(`Error generando contenido: ${error.message}`);
            throw error;
        }
    }
    isConfigured() {
        return !!this.apiKey;
    }
    async processMessage(message) {
        try {
            const tools = await this.mcpService.getTools();
            this.logger.log(`📋 Tools disponibles: ${tools.length}`);
            const model = this.createModelWithTools(tools);
            const chat = model.startChat();
            this.logger.log('Enviando mensaje a Gemini (esperando Tool Call)...');
            const result = await chat.sendMessage(message);
            const response = result.response;
            const call = response.functionCalls()?.[0];
            if (call) {
                this.logger.log(`🔧 Gemini solicitó ejecutar tool: ${call.name}`);
                const toolResult = await this.mcpService.executeToolCall(call.name, call.args || {});
                this.logger.log('✅ Tool ejecutado correctamente');
                return {
                    response: `He ejecutado la herramienta "${call.name}" para ayudarte. Resultado: ${JSON.stringify(toolResult.content?.[0]?.text || toolResult, null, 2)}`,
                    toolsCalled: [{
                            name: call.name,
                            arguments: call.args,
                            result: toolResult,
                        }],
                };
            }
            return {
                response: response.text(),
                toolsCalled: [],
            };
        }
        catch (error) {
            this.logger.error(`Error procesando mensaje: ${error.message}`);
            throw error;
        }
    }
};
exports.GeminiService = GeminiService;
exports.GeminiService = GeminiService = GeminiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mcp_service_1.McpService])
], GeminiService);
//# sourceMappingURL=gemini.service.js.map
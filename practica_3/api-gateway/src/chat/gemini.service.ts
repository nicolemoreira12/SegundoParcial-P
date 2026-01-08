import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { GoogleGenerativeAI, FunctionCallingMode } from '@google/generative-ai';
import { McpService } from './mcp.service';

@Injectable()
export class GeminiService implements OnModuleInit {
    private readonly logger = new Logger(GeminiService.name);
    private genAI: GoogleGenerativeAI;
    private apiKey: string;

    constructor(private readonly mcpService: McpService) {
        // Validar que existe la API Key
        this.apiKey = process.env.GEMINI_API_KEY;

        if (!this.apiKey) {
            throw new Error(
                'GEMINI_API_KEY no está configurada. Por favor, configura la variable de entorno.',
            );
        }

        this.genAI = new GoogleGenerativeAI(this.apiKey);
        this.logger.log('✅ Gemini AI inicializado correctamente');
    }

    onModuleInit() {
        this.logger.log('Gemini Service listo para usar');
    }

    /**
     * Crear un modelo de Gemini con tools (function calling)
     * Convierte las tools MCP al formato de Gemini
     */
    createModelWithTools(tools: any[]) {
        try {
            this.logger.log(`Creando modelo con ${tools.length} tools`);

            // Convertir tools MCP a formato Gemini
            const geminiTools = tools.map((tool) => ({
                name: tool.name,
                description: tool.description,
                parameters: tool.inputSchema,
            }));

            // Usar gemini-2.5-flash que es el que aparece en tu lista de modelos permitidos
            const model = this.genAI.getGenerativeModel({
                model: 'gemini-2.5-flash',
                generationConfig: {
                    temperature: 0, // Máxima determinación y precisión
                    topP: 0.95,
                    maxOutputTokens: 2048,
                },
                toolConfig: {
                    functionCallingConfig: {
                        mode: FunctionCallingMode.ANY, // FORZAR el uso de tools
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
        } catch (error) {
            this.logger.error(`Error creando modelo: ${error.message}`);
            throw error;
        }
    }

    /**
     * Crear un modelo SOLO para extracción (sin tools)
     */
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
        } catch (error) {
            this.logger.error(`Error creando modelo de extracción: ${error.message}`);
            throw error;
        }
    }

    /**
     * Generar contenido con el modelo
     */
    async generateContent(model: any, parts: any[]) {
        try {
            this.logger.log('Generando contenido con Gemini...');

            const result = await model.generateContent({
                contents: [{ role: 'user', parts }],
            });

            this.logger.log('✅ Contenido generado');
            return result;
        } catch (error) {
            this.logger.error(`Error generando contenido: ${error.message}`);
            throw error;
        }
    }

    /**
     * Verificar si Gemini está configurado
     */
    isConfigured(): boolean {
        return !!this.apiKey;
    }

    /**
     * Procesar mensaje del usuario con Gemini y ejecutar tools
     */
    async processMessage(message: string): Promise<{ response: string; toolsCalled: any[] }> {
        try {
            // 1. Obtener tools disponibles del MCP Server
            const tools = await this.mcpService.getTools();
            this.logger.log(`📋 Tools disponibles: ${tools.length}`);

            // 2. Crear el chat con las tools integradas (formato nativo Gemini)
            const model = this.createModelWithTools(tools);
            const chat = model.startChat();

            // 3. Enviar el mensaje
            this.logger.log('Enviando mensaje a Gemini (esperando Tool Call)...');
            const result = await chat.sendMessage(message);
            const response = result.response;
            const call = response.functionCalls()?.[0];

            // 4. Si Gemini llamó a una función
            if (call) {
                this.logger.log(`🔧 Gemini solicitó ejecutar tool: ${call.name}`);

                // Ejecutar el tool en el MCP Server
                const toolResult = await this.mcpService.executeToolCall(
                    call.name,
                    call.args || {},
                );

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

            // Si por alguna razón no llamó a tool (aunque mode ANY lo obliga)
            return {
                response: response.text(),
                toolsCalled: [],
            };
        } catch (error) {
            this.logger.error(`Error procesando mensaje: ${error.message}`);
            throw error;
        }
    }
}

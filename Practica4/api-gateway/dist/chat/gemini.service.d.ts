import { OnModuleInit } from '@nestjs/common';
import { McpService } from './mcp.service';
export declare class GeminiService implements OnModuleInit {
    private readonly mcpService;
    private readonly logger;
    private genAI;
    private apiKey;
    constructor(mcpService: McpService);
    onModuleInit(): void;
    createModelWithTools(tools: any[]): import("@google/generative-ai").GenerativeModel;
    createExtractionModel(): import("@google/generative-ai").GenerativeModel;
    generateContent(model: any, parts: any[]): Promise<any>;
    isConfigured(): boolean;
    processMessage(message: string): Promise<{
        response: string;
        toolsCalled: any[];
    }>;
}

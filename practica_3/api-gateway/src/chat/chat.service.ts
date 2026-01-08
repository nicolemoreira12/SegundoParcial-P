import { Injectable } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { ChatRequestDto, ChatResponseDto } from './chat.dto';

@Injectable()
export class ChatService {
    constructor(private readonly geminiService: GeminiService) { }

    async processChat(chatRequest: ChatRequestDto): Promise<ChatResponseDto> {
        const { message } = chatRequest;

        console.log(`\n💬 Usuario: ${message}`);

        try {
            const { response, toolsCalled } = await this.geminiService.processMessage(message);

            console.log(`🤖 Gemini: ${response}`);
            console.log(`🔧 Tools ejecutados: ${toolsCalled.length}\n`);

            return {
                response,
                toolsCalled: toolsCalled.length > 0 ? toolsCalled : undefined,
                timestamp: new Date().toISOString(),
            };
        } catch (error: any) {
            console.error('❌ Error procesando chat:', error.message);

            return {
                response: `Lo siento, ocurrió un error: ${error.message}`,
                timestamp: new Date().toISOString(),
            };
        }
    }
}

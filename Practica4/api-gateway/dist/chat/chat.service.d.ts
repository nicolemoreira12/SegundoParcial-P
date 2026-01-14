import { GeminiService } from './gemini.service';
import { ChatRequestDto, ChatResponseDto } from './chat.dto';
export declare class ChatService {
    private readonly geminiService;
    constructor(geminiService: GeminiService);
    processChat(chatRequest: ChatRequestDto): Promise<ChatResponseDto>;
}

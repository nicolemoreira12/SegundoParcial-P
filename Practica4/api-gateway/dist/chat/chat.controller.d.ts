import { ChatService } from './chat.service';
import { ChatRequestDto, ChatResponseDto } from './chat.dto';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    chat(chatRequest: ChatRequestDto): Promise<ChatResponseDto>;
}

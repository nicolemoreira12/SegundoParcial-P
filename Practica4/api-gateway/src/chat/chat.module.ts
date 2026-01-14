import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { GeminiService } from './gemini.service';
import { McpService } from './mcp.service';

@Module({
    controllers: [ChatController],
    providers: [ChatService, GeminiService, McpService],
})
export class ChatModule { }

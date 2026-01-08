import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class ChatRequestDto {
    @IsString()
    @IsNotEmpty()
    message: string;

    @IsOptional()
    @IsArray()
    history?: Array<{ role: string; content: string }>;
}

export class ChatResponseDto {
    response: string;
    toolsCalled?: Array<{
        name: string;
        arguments: any;
        result: any;
    }>;
    timestamp: string;
}

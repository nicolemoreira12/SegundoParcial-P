export declare class ChatRequestDto {
    message: string;
    history?: Array<{
        role: string;
        content: string;
    }>;
}
export declare class ChatResponseDto {
    response: string;
    toolsCalled?: Array<{
        name: string;
        arguments: any;
        result: any;
    }>;
    timestamp: string;
}

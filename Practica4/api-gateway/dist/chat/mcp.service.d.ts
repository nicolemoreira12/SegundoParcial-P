interface Tool {
    name: string;
    description: string;
    inputSchema: any;
}
interface ToolCallResult {
    name: string;
    arguments: any;
    result: any;
}
export declare class McpService {
    private readonly mcpServerUrl;
    constructor();
    getTools(): Promise<Tool[]>;
    executeToolCall(toolName: string, args: any): Promise<any>;
    executeMultipleTools(toolCalls: Array<{
        name: string;
        args: any;
    }>): Promise<ToolCallResult[]>;
}
export {};

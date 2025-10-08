import { WebSocketServer } from 'ws';
declare class WebsocketService extends WebSocketServer {
    private static websocketService;
    private readonly auth;
    private readonly userConfig;
    private readonly roomId;
    private readonly bili;
    private readonly tinyBiliWs;
    private minecraft;
    private readonly host;
    private readonly port;
    private constructor();
    static create(): WebsocketService;
    core(): Promise<void>;
    private parseEventResult;
}
export default WebsocketService;
//# sourceMappingURL=WebSocketService.d.ts.map
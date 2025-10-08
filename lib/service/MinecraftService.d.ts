import ICommandResult from '../interface/ICommandResult';
import { WebSocket } from 'ws';
declare class MinecraftService {
    private static readonly REGEXP;
    private socket;
    constructor(socket: InstanceType<typeof WebSocket.WebSocket>);
    static parseCommand(message: string): ICommandResult;
    subscribe(eventName: string): void;
    sendActionBar(content: string): void;
    sendMessage(content: string): void;
    sendCommand(content: string): void;
}
export default MinecraftService;
//# sourceMappingURL=MinecraftService.d.ts.map
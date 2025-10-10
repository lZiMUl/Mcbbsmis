import { WebSocket } from 'ws';
import BiliSender from 'bili-sender';
import ICommandResult from '../interface/ICommandResult';
declare class MinecraftService {
    private readonly identifier;
    private readonly identifierRegExp;
    readonly player: string;
    private socket;
    constructor(socket: InstanceType<typeof WebSocket>);
    parseCommand(message: string): ICommandResult;
    subscribe(eventName: string): void;
    sendActionBar(content: string): void;
    sendMessage(content: string): void;
    sendCommand(content: string): void;
    parseEventResult(rawData: string, bili: BiliSender): void;
}
export default MinecraftService;
//# sourceMappingURL=MinecraftService.d.ts.map
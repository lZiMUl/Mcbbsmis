import Config from '../config';
import ICommandResult from '../interface/ICommandResult';
import { WebSocket } from 'ws';

class MinecraftService {
  private static readonly REGEXP: string = `(${(
    Config.get('global', 'identifier') || '$'
  ).replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})([\\w\\u4e00-\\u9fa5]+)\\s*(.*)`;
  public readonly player: string = Config.get('xbox', 'username');
  private socket: WebSocket;

  public constructor(socket: InstanceType<typeof WebSocket.WebSocket>) {
    this.socket = socket;
    this.subscribe('PlayerMessage');
  }

  public static parseCommand(message: string): ICommandResult {
    const data: RegExpMatchArray | null = message.match(
      MinecraftService.REGEXP
    );
    return {
      identifier: data?.at(1) as string,
      command: data?.at(2) as string,
      content: data?.at(3) ?? ''
    };
  }

  public subscribe(eventName: string) {
    this.socket.send(
      JSON.stringify({
        body: {
          eventName
        },
        header: {
          requestId: Config.APP_UUID,
          messagePurpose: 'subscribe',
          version: 1,
          messageType: 'commandRequest'
        }
      })
    );
  }

  public sendActionBar(content: string): void {
    this.sendCommand(`title ${this.player} actionbar ${content}`);
  }

  public sendMessage(content: string): void {
    this.sendCommand(
      `tellraw ${this.player} ${JSON.stringify({
        rawtext: [
          { text: '§l§o§b(§l§o§3Mcbbsmis§l§o§b) §f' },
          { text: content }
        ]
      })}`
    );
  }

  public sendCommand(content: string): void {
    this.socket.send(
      JSON.stringify({
        body: {
          origin: {
            type: 'player'
          },
          commandLine: `/${content.replace(new RegExp('^/', 'im'), '')}`,
          version: 1
        },
        header: {
          requestId: Config.APP_UUID,
          messagePurpose: 'commandRequest',
          version: 1,
          messageType: 'commandRequest'
        }
      })
    );
  }
}

export default MinecraftService;

import Config from '../config';
import IEventResult from '../interface/IEventResult';

class MinecraftService {
  private socket: WebSocket;

  public constructor(socket: any) {
    this.socket = socket;
    this.init();
  }

  private init() {
    this.subscribe('PlayerMessage');
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

  public unsubscribe() {}

  public static ParseResBody(rawMessage: string): IEventResult {
    return JSON.parse(rawMessage) as IEventResult;
  }

  public sendMessage(content: string): void {
    const json: string = JSON.stringify({
      rawtext: [{ text: '§l§o§b(§l§o§3Mcbbsmis§l§o§b) §f' }, { text: content }]
    });
    this.sendCommand(`tellraw @a ${json}`);
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

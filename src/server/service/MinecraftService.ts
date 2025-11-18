import { WebSocket } from 'ws';
import BiliSender from 'bili-sender';
import Config from '../config';
import ICommandResult from '../interface/ICommandResult';
import IEventResult from '../interface/IEventResult';

class MinecraftService {
  private readonly identifier: string = Config.get('global', 'identifier');
  private readonly identifierRegExp: string = `(${this.identifier.replace(
    /[-/\\^$*+?.()|[\]{}]/g,
    '\\$&'
  )})([\\w\\u4e00-\\u9fa5]+)\\s*(.*)`;
  public readonly player: string = Config.get('xbox', 'username');
  private socket: WebSocket;

  public constructor(socket: InstanceType<typeof WebSocket>) {
    this.socket = socket;
    this.subscribe('PlayerMessage');
  }

  public parseCommand(message: string): ICommandResult {
    const data: RegExpMatchArray | null = message.match(this.identifierRegExp);
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

  public parseEventResult(rawData: string, bili: BiliSender): void {
    const {
      body: { message, sender, type }
    }: IEventResult = JSON.parse(rawData);

    switch (type) {
      case 'chat':
        {
          if (sender === this.player) {
            const { identifier, command, content }: ICommandResult =
              this.parseCommand(message);
            if (identifier === this.identifier) {
              switch (command) {
                case 'help':
                  {
                    this.sendMessage(
                      `§9Helper §a${Config.LANGUAGE.get('#23')}`
                    );
                  }
                  break;
                case 'send':
                  {
                    bili?.send(content);
                  }
                  break;

                case 'config': {
                  this.sendMessage(Config.LANGUAGE.get('#-1'));
                  break;
                }

                default: {
                  this.sendMessage(Config.LANGUAGE.get('#20'));
                }
              }
            }
          }
        }
        break;
    }
  }
}

export default MinecraftService;

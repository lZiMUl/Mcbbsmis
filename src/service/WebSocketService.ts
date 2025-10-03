import BiliSender, { IConfig } from 'bili-sender';
import { RawData, WebSocketServer } from 'ws';
import Config from '../config';
import AuthUnit from '../unit/AuthUnit';
import IEventResult from '../interface/IEventResult';
import MinecraftService from './MinecraftService';

class WebsocketService extends WebSocketServer {
  private readonly auth: AuthUnit = AuthUnit.create(Config.APP_UUID);
  private readonly userConfig: IConfig = {
    Cookie: this.auth.get(Config.APP_UUID)
  };
  private roomId: number = Config.get('bilibili', 'roomid');
  private bili: BiliSender = new BiliSender(this.roomId, this.userConfig);
  private tinyBiliWs = import('tiny-bilibili-ws');
  private minecraft: MinecraftService | undefined;
  private readonly host: string;
  private readonly port: number;

  public constructor(
    host: string = Config.get('global', 'host'),
    port: number = Config.get('global', 'port')
  ) {
    super({ host, port });
    this.host = host;
    this.port = port;
    this.core();
  }
  public async core(): Promise<void> {
    try {
      const { KeepLiveWS } = await this.tinyBiliWs;

      const client = new KeepLiveWS(Config.get('bilibili', 'roomid'), {
        headers: {
          Cookie: this.auth.get(Config.APP_UUID)
        },
        uid: Config.get('bilibili', 'userid')
      });

      Config.LOGGER.info(Config.LANGUAGE.get('#16'));
      client.reconnect();
      await client.runWhenConnected();
      Config.LOGGER.info(Config.LANGUAGE.get('#17'));
      Config.LOGGER.info(
        `${Config.LANGUAGE.get('#18')} => /connect ws://${this.host === '0.0.0.0' ? '127.0.0.1' : this.host}:${this.port}`
      );
      super.addListener('connection', socket => {
        this.minecraft = new MinecraftService(socket);
        Config.LOGGER.info(Config.LANGUAGE.get('#19'));
        client.addListener('DANMU_MSG', ({ data }): void => {
          const danmu: string = data.info.at(1);
          const username: string = data.info.at(2).at(1);
          if (username !== Config.get('bilibili', 'username')) {
            Config.LOGGER.info(`[${username}]: ${danmu}`);
            this.minecraft?.sendMessage(
              `§l§o§9Barrage §l§o§b[§l§o§c${username}§l§o§b]§l§o§d: §l§o§6${danmu.replace(new RegExp('@e', 'img'), '')}`
            );
          }
        });
        client.addListener(
          'SEND_GIFT',
          ({
            data: {
              data: { uname, action, giftName, num }
            }
          }): void => {
            Config.LOGGER.info(`[${uname}]: ${action} ${giftName} * ${num}`);
            this.minecraft?.sendMessage(
              `§l§o§9Gift §l§o§b[§l§o§c${uname}§l§o§b]§l§o§d: §l§o§6${action} §l§o§b${giftName} §l§o§6* §l§o§a${num}`
            );
          }
        );
        socket.addListener('message', (message: RawData): void => {
          this.parseEventResult(
            MinecraftService.ParseResBody(message.toString())
          );
        });
      });

      ['error', 'close', 'wsClientError'].forEach((event: string): void => {
        super.addListener(event, (): boolean => client.close());
      });
    } catch (e) {
      console.info(e);
    }
  }

  private parseEventResult(eventResult: IEventResult): void {
    const message: string = eventResult.body.message;
    const sender: string = eventResult.body.sender;
    const xbox: string = Config.get('xbox', 'username');

    if (sender !== xbox) {
      return;
    }

    const command_content: Array<string> = message
      .replaceAll(new RegExp('( )+', 'img'), ' ')
      .split(' ');
    const command_prefix: string | void = command_content.at(0)?.at(0);
    const command_event: string | void = command_content
      .at(0)
      ?.substring(1, command_content.at(0)?.length);
    const command_body: string | void = message.replaceAll(
      new RegExp('^\\$send ', 'img'),
      ''
    );

    if (
      command_prefix === Config.get('global', 'command_prefix') &&
      command_body
    ) {
      switch (command_event) {
        case 'send':
          {
            this.bili.send(command_body);
          }
          break;

        case 'config': {
          this.minecraft?.sendMessage(Config.LANGUAGE.get('#-1'));
          break;
        }

        default: {
          this.minecraft?.sendMessage(Config.LANGUAGE.get('#20'));
        }
      }
    }
  }
}

export default WebsocketService;

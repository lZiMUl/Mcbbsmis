import { clearInterval, setInterval } from 'node:timers';
import { Command, OptionValues } from 'commander';
import open from 'open';
import Config from './config';
import WebService from './service/WebService';
import WebsocketService from './service/WebSocketService';
import InitUtils from './utils/InitUtils';
import LogoUtils from './utils/LogoUtils';
import UpdateUtils from './utils/UpdateUtils';
import BaseUtils from './utils/BaseUtils';
import AuthUtils from './utils/AuthUtils';

function App(uuid: string): void {
  const program: Command = new Command(Config.APP_NAME);

  program.version(Config.APP_VERSION);

  program.option('-c, --configure-panel', 'Open Web Configure Panel', false);

  program.parse(process.argv);

  const options: OptionValues = program.opts();

  const auth: AuthUtils = AuthUtils.create(uuid);

  const checkLogin: NodeJS.Timeout = setInterval((): void => {
    if (auth.has(uuid)) {
      clearInterval(checkLogin);
      Config.LOGGER.info(Config.LANGUAGE.get('#15'));

      if (options.configurePanel) {
        const [host, port] = [
          Config.get('global', 'host'),
          Config.get('global', 'port') + 1
        ];
        WebService.listen(
          {
            host,
            port
          },
          async (): Promise<void> => {
            const WEB_URL: string = `http://${host === '0.0.0.0' ? '127.0.0.1' : host}:${port}`;
            try {
              await open(WEB_URL);
            } catch (error) {
              if (error instanceof Error) {
                Config.LOGGER.info(WEB_URL);
              }
            }
          }
        );
      } else {
        WebsocketService.create();
      }
    }
  }, 2000);
}

LogoUtils(`${Config.APP_NAME}`, 100, 100).then(() => {
  Config.LOGGER.info(Config.LANGUAGE.get('#0'));
  Config.LOGGER.info(Config.LANGUAGE.get('#3'));

  UpdateUtils().finally((): void => {
    Config.LOGGER.info(Config.LANGUAGE.get('#8'));
    InitUtils();
  });
});

process.on('SIGINT', (): void =>
  Config.LOG4JS.shutdown((): void => BaseUtils.exitWithMessage())
);
process.on('SIGTERM', (): void =>
  Config.LOG4JS.shutdown((): void => BaseUtils.exitWithMessage())
);
process.on('beforeExit', (): void => Config.LOG4JS.shutdown());

export default App;

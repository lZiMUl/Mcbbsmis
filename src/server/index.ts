import { Command, OptionValues } from 'commander';
import Config from './config';
import update from './unit/UpdateUnit';
import WebService from './service/WebService';
import WebsocketService from './service/WebSocketService';
import AuthUnit from './unit/AuthUnit';
import open from 'open';
import LogoUnit from './unit/LogoUnit';
import InitUnit from './unit/InitUnit';
import { clearInterval, setInterval } from 'node:timers';
import BaseUnit from './unit/BaseUnit';

function App(uuid: string): void {
  const program: Command = new Command(Config.APP_NAME);

  program.version(Config.APP_VERSION);

  program.option('-c, --configure-panel', 'Open Web Configure Panel', false);

  program.parse(process.argv);

  const options: OptionValues = program.opts();

  const auth: AuthUnit = AuthUnit.create(uuid);

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
              Config.LOGGER.info(WEB_URL);
            }
          }
        );
      } else WebsocketService.create();
    }
  }, 2000);
}

LogoUnit(`${Config.APP_NAME}`, 100, 100).then(() => {
  Config.LOGGER.info(Config.LANGUAGE.get('#0'));
  Config.LOGGER.info(Config.LANGUAGE.get('#3'));

  update().finally((): void => {
    Config.LOGGER.info(Config.LANGUAGE.get('#8'));
    InitUnit();
  });
});

process.on('SIGINT', (): void =>
  Config.LOG4JS.shutdown((): void => BaseUnit.exitWithMessage())
);
process.on('SIGTERM', (): void =>
  Config.LOG4JS.shutdown((): void => BaseUnit.exitWithMessage())
);
process.on('beforeExit', (): void => Config.LOG4JS.shutdown());

export default App;

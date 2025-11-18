import { Command, OptionValues } from 'commander';
import Config from './config';
import update from './unit/UpdateUnit';
import WebService from './service/WebService';
import WebsocketService from './service/WebSocketService';
import InitUnit from './unit/InitUnit';
import AuthUnit from './unit/AuthUnit';
import open from 'open';

Config.LOGGER.info(Config.LANGUAGE.get('#0'));
Config.LOGGER.info(Config.LANGUAGE.get('#3'));

function App(): void {
  const auth: AuthUnit = AuthUnit.create(Config.APP_UUID);
  setTimeout((): void => {
    if (!auth.has(Config.APP_UUID)) {
      return App();
    }
    Config.LOGGER.info(Config.LANGUAGE.get('#15'));
    const program: Command = new Command(Config.APP_NAME);

    program.version(Config.APP_VERSION);

    program.option('-c, --configure-panel', 'Open Web Configure Panel', false);

    program.parse(process.argv);

    const options: OptionValues = program.opts();
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
          } catch (e) {
            Config.LOGGER.info(WEB_URL);
          }
        }
      );
    } else WebsocketService.create();
  }, 2000);
}

update().finally((): void => {
  Config.LOGGER.info(Config.LANGUAGE.get('#8'));
  InitUnit();
});

export default App;

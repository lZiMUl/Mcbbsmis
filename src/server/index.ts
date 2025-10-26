import Config from './config';
import update from './unit/UpdateUnit';
import WebService from './service/WebService';
import WebsocketService from './service/WebSocketService';
import InitUnit from './unit/InitUnit';
import AuthUnit from './unit/AuthUnit';

Config.LOGGER.info(Config.LANGUAGE.get('#0'));
Config.LOGGER.info(Config.LANGUAGE.get('#3'));

let status: boolean = false;

function App(): void {
  const auth: AuthUnit = AuthUnit.create(Config.APP_UUID);
  setTimeout((): void => {
    if (!auth.has(Config.APP_UUID)) {
      return App();
    }
    Config.LOGGER.info(Config.LANGUAGE.get('#15'));
    WebsocketService.create();
    status = true;
  }, 2000);
}

update().finally((): void => {
  Config.LOGGER.info(Config.LANGUAGE.get('#8'));
  InitUnit();
  const [host, port] = [
    Config.get('global', 'host') || '0.0.0.0',
    (Config.get('global', 'port') || 5700) + 1
  ];

  const WEB_URL: string = `http://${host === '0.0.0.0' ? '127.0.0.1' : host}:${port}`;

  WebService.listen({
    host,
    port
  });

  Config.LOGGER.info(WEB_URL);
});

export default App;
export { Config, update, WebsocketService, InitUnit, AuthUnit, status };

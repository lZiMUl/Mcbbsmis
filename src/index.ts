import Config from './config';
import update from './unit/UpdateUnit';
import WebsocketService from './service/WebSocketService';

Config.LOGGER.info(Config.LANGUAGE.get('#0'));
import InitUnit from './unit/InitUnit';
import AuthUnit from './unit/AuthUnit';
Config.LOGGER.info(Config.LANGUAGE.get('#3'));

function App(): void {
  const auth: AuthUnit = AuthUnit.create(Config.APP_UUID);
  setTimeout((): void => {
    if (!auth.has(Config.APP_UUID)) {
      return App();
    }
    Config.LOGGER.info(Config.LANGUAGE.get('#15'));
    new WebsocketService();
  }, 2000);
}

update().finally((): void => {
  Config.LOGGER.info(Config.LANGUAGE.get('#8'));
  InitUnit();
  App();
});

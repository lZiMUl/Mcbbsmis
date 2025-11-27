import { existsSync, mkdirSync } from 'node:fs';
import Config from '../config';
import BaseUnit from './BaseUnit';
import ELanguage from '../enum/ELanguage';
import ProfileUnit, { CreateProfileUnit } from './ProfileUnit';
import ProfileManager from './ProfileManagerUnit';

function InitUnit(force: boolean = false): void {
  if (!existsSync(Config.CONFIG_ROOT_PATH))
    mkdirSync(Config.CONFIG_ROOT_PATH, { recursive: true });
  if (!existsSync(Config.PROFILES_DIR_PATH))
    mkdirSync(Config.PROFILES_DIR_PATH, { recursive: true });
  if (!existsSync(Config.COOKIES_DIR_PATH))
    mkdirSync(Config.COOKIES_DIR_PATH, { recursive: true });

  if (force) {
    Config.LOGGER.info(Config.LANGUAGE.get('#2'));
    BaseUnit.saveFile(
      Config.getProfilePath,
      BaseUnit.formatConfigurationTemplate({
        host: '0.0.0.0',
        port: 5700,
        language: ELanguage.EN_US,
        identifier: '$',
        join: false,
        follow: false,
        share: false,
        view: false,
        online: false,
        like: true,
        danmaku: true,
        gift: true,
        roomid: 9329583,
        userid: 291883246,
        username_bili: 'lZiMUl',
        username_xbox: 'lZiMUl',
        geyser: false,
        floodgate: false
      })
    );
    return;
  }
  const profilesExists: boolean = existsSync(Config.PROFILES_FILE_PATH);
  if (!profilesExists) {
    CreateProfileUnit();
    return;
  }

  const profileManager: ProfileManager = ProfileManager.create();

  const profileExists: boolean = existsSync(
    profileManager.getFilePathById(profileManager.getLastUsed)
  );

  if (!profileExists) {
    Config.LOGGER.warn(Config.LANGUAGE.get('#1'));
    Config.LOGGER.info(Config.LANGUAGE.get('#2'));
    profileManager.delete();
    CreateProfileUnit();
    return;
  }

  ProfileUnit();
}

export default InitUnit;

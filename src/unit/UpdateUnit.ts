import axios from 'axios';
import semver from 'semver';

import { version as localVersion } from '../../package.json';
import Config from '../config';

async function UpdateUnit(): Promise<void> {
  try {
    const { data } = await axios({
      url: Config.UPDATE_URL,
      method: 'GET',
      timeout: 50000
    });

    const { version: remoteVersion } = JSON.parse(data);

    if (semver.gt(remoteVersion, localVersion)) {
      Config.LOGGER.info(Config.LANGUAGE.get('#4'));
    }
  } catch (e) {
    Config.LOGGER.error(Config.LANGUAGE.get('#5'));
  }
}
export default UpdateUnit;

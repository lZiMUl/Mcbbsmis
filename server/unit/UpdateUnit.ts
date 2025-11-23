import axios, { AxiosResponse } from 'axios';
import semver from 'semver';

// @ts-ignore
import { version as localVersion } from '../../package.json';
import Config from '../config';

interface VersionResult {
  version: string;
}

async function UpdateUnit(): Promise<void> {
  try {
    const { data }: AxiosResponse<VersionResult> = await axios<VersionResult>({
      url: Config.UPDATE_URL,
      method: 'GET',
      timeout: 5000
    });

    const { version: remoteVersion }: VersionResult = data;
    if (semver.gt(remoteVersion, localVersion)) {
      Config.LOGGER.warn(Config.LANGUAGE.get('#4'));
    } else {
      Config.LOGGER.info(Config.LANGUAGE.get('#31'));
    }
  } catch (err: unknown) {
    Config.LOGGER.error(Config.LANGUAGE.get('#5'));
  }
}
export default UpdateUnit;

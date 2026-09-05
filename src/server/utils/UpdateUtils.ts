import axios, { AxiosResponse } from 'axios';
import semver from 'semver';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { version as localVersion } from '../../package.json';
import Config from '../config';

interface VersionResult {
  version: string;
}

async function UpdateUtils(): Promise<void> {
  try {
    const { data }: AxiosResponse<VersionResult> = await axios<VersionResult>({
      baseURL: Config.NETWORK_URL.BaseUrl,
      url: Config.NETWORK_URL.UpdatePath,
      method: 'GET',
      timeout: 5000
    });

    const { version: remoteVersion }: VersionResult = data;
    if (semver.gt(remoteVersion, localVersion)) {
      Config.LOGGER.warn(Config.LANGUAGE.get('#4'));
    } else {
      Config.LOGGER.info(Config.LANGUAGE.get('#31'));
    }
  } catch {
    Config.LOGGER.error(Config.LANGUAGE.get('#5'));
  }
}

export default UpdateUtils;

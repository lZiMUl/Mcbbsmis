import axios from 'axios';
import Config from '../config';

async function UpdateUnit(): Promise<void> {
  try {
    const { data } = await axios({
      url: Config.UPDATE_URL,
      method: 'GET',
      timeout: 50000
    });

    const { code } = JSON.parse(data);
    if (code === 200) {
      Config.LOGGER.info(Config.LANGUAGE.get('#4'));
    }
  } catch (e) {}
  Config.LOGGER.error(Config.LANGUAGE.get('#5'));
}
export default UpdateUnit;

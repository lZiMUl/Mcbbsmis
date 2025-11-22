// @ts-ignore
import { input, select, Separator } from '@inquirer/prompts';
import Config from '../config';
import { EMenu, ESelectProfileMenu } from '../enum/EMenu';
import BaseUnit, { TLogSeparator } from './BaseUnit';
import { IProfile } from '../interface/IProfileTemplate';
import App from '../index';
import OptionsUnit, { IOptionsG } from './OptionsUnit';
import ProfileManager from './ProfileManagerUnit';

const stepBar: TLogSeparator = BaseUnit.logSeparator(0);

async function CreateProfileUnit() {
  const profileManager: ProfileManager = ProfileManager.create();
  const profileName: string = await input({
    message: 'Create an Profile',
    default: 'Default',
    required: true
  });
  OptionsUnit().then((result: IOptionsG | void): void => {
    if (result) {
      BaseUnit.saveFile(
        profileManager.buildProfilePath(profileName),
        BaseUnit.ConfigurationTemplate(result)
      );
      Config.LOGGER.info(
        '✅ Configuration completed. Please restart the project to take effect.'
      );
      Config.LOGGER.info(
        'The program will exit automatically in 2 seconds...\n'
      );
      setTimeout((): never => process.exit(0), 2 * 1000);
    }
  });
}

function ProfileUnit(): void {
  const profileManager: ProfileManager = ProfileManager.create();

  void new Promise(async (): Promise<void> => {
    try {
      // Menu
      stepBar('Mcbbsmis Main Menu');
      const menu: EMenu = await select({
        message: 'Menu: ',
        choices: [
          {
            name: `Continue? (${profileManager.getNameById(profileManager.getLastUsed)})`,
            value: EMenu.CONTINUE
          },
          {
            name: 'Select an profile',
            value: EMenu.PROFILE
          },
          {
            name: 'Exit',
            value: EMenu.EXIT
          }
        ]
      });

      switch (menu) {
        case EMenu.CONTINUE:
          App(profileManager.getLastUsed);
          break;
        case EMenu.PROFILE:
          await SelectProfile(profileManager);
          break;
        case EMenu.EXIT:
          process.exit(0);
          break;
      }
    } catch (error) {
      Config.LOGGER.warn('Project was forcibly stopped by the user.');
    }
  });
}

type Choice = {
  value: ESelectProfileMenu | string;
  name?: string;
};

async function SelectProfile(profileManager: ProfileManager): Promise<void> {
  try {
    stepBar('Mcbbsmis Profile Menu');
    const selectProfileMenu: ESelectProfileMenu | string = await select({
      message: 'Profile Menu: ',
      choices: [
        {
          name: `Create an Profile`,
          value: ESelectProfileMenu.CREATE
        },
        {
          name: 'Back',
          value: ESelectProfileMenu.BACK
        },
        new Separator('---------------------'),
        ...profileManager.getProfiles.map(({ uuid }: IProfile): Choice => {
          return {
            value: uuid,
            name: profileManager.getNameById(uuid)
          };
        })
      ]
    });

    switch (selectProfileMenu) {
      case ESelectProfileMenu.CREATE:
        await CreateProfileUnit();
        break;
      case ESelectProfileMenu.BACK:
        ProfileUnit();
        break;

      default:
        profileManager.setProfile(selectProfileMenu);
        Config.reload();
        ProfileUnit();
    }
  } catch (error) {
    Config.LOGGER.warn('Project was forcibly stopped by the user.');
  }
}

export default ProfileUnit;
export { ProfileManager, CreateProfileUnit };

import { input, select, Separator } from '@inquirer/prompts';
import Config from '../config';
import { EMenu, ESelectProfileMenu } from '../enum/EMenu';
import BaseUtils, { TLogSeparator } from './BaseUtils';
import { IProfile } from '../interface/IProfileTemplate';
import App from '../index';
import OptionsUtils, { IOptionsGenerator } from './OptionsUtils';
import ProfileManager from './ProfileManagerUtils';

type Choice = {
  value: ESelectProfileMenu | string;
  name?: string;
};

const stepBar: TLogSeparator = BaseUtils.createLogSeparator(0);

async function CreateProfileUnit(): Promise<void> {
  try {
    const profileManager: ProfileManager = ProfileManager.create();
    const profileName: string = await input({
      message: 'Create an Profile: ',
      default: 'Default',
      required: true,
      validate: (value: string): string | boolean => {
        const exists = profileManager.getProfiles.some(
          ({ name }: IProfile) => name === value
        );

        return exists
          ? '⚠ The name already exists. Please use a different name.'
          : true;
      }
    });

    OptionsUtils().then((result: IOptionsGenerator | void): void => {
      if (result) {
        BaseUtils.saveFile(
          profileManager.buildProfilePath(profileName),
          BaseUtils.formatConfigurationTemplate(result)
        );
        Config.LOGGER.info(
          '✅ Configuration completed. Please restart the project to take effect.'
        );
        BaseUtils.exitWithMessage(Config.MESSAGE.AUTO_EXIT, 2);
      }
    });
  } catch {
    BaseUtils.exitWithMessage(Config.MESSAGE.FORCE_EXIT);
  }
}

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
        // eslint-disable-next-line no-use-before-define
        ProfileUtils();
        break;

      default:
        profileManager.setProfile(selectProfileMenu);
        Config.reload();
        // eslint-disable-next-line no-use-before-define
        ProfileUtils();
    }
  } catch {
    BaseUtils.exitWithMessage(Config.MESSAGE.FORCE_EXIT);
  }
}

function ProfileUtils(): void {
  const profileManager: ProfileManager = ProfileManager.create();

  void new Promise((): void => {
    try {
      // Menu
      stepBar('Mcbbsmis Main Menu');
      select({
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
      }).then((menu: EMenu): void => {
        switch (menu) {
          case EMenu.CONTINUE:
            App(profileManager.getLastUsed);
            break;
          case EMenu.PROFILE:
            SelectProfile(profileManager);
            break;
          case EMenu.EXIT:
            BaseUtils.exitWithMessage();
            break;
        }
      });
    } catch {
      BaseUtils.exitWithMessage(Config.MESSAGE.FORCE_EXIT);
    }
  });
}

export default ProfileUtils;
export { ProfileManager, CreateProfileUnit };

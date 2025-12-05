import IProfileTemplate, { IProfile } from '../interface/IProfileTemplate';
import Config from '../config';
import BaseUnit from './BaseUnit';
import fs from 'node:fs';
import { faker } from '@faker-js/faker/locale/ar';
import { join } from 'node:path';
import InitUnit from './InitUnit';

class DataSever {
  protected readonly root: string;
  public constructor(root: string) {
    this.root = root;
  }

  public load(): IProfileTemplate {
    try {
      return JSON.parse(
        fs.readFileSync(join(this.root, '../profiles.json'), {
          encoding: 'utf-8'
        })
      ) as IProfileTemplate;
    } catch (error) {
      return {
        lastUsed: '',
        profiles: []
      };
    }
  }

  public save(profileTemplate: IProfileTemplate): void {
    BaseUnit.saveFile(
      Config.PROFILES_FILE_PATH,
      BaseUnit.formatProfileTemplate(profileTemplate)
    );
  }
}

class ProfileManager extends DataSever {
  private static INSTANCE: ProfileManager;
  private content: IProfileTemplate;
  private constructor(root: string) {
    super(root);
    this.content = super.load();
  }

  public get getLastUsed(): string {
    return this.content?.lastUsed ?? Config.APP_UUID;
  }

  public get getProfiles(): Array<IProfile> {
    return (
      this.content?.profiles ?? [
        {
          name: 'Default',
          uuid: Config.APP_UUID,
          createTime: new Date().getTime()
        }
      ]
    );
  }

  public static create(
    root: string = Config.PROFILES_FILE_PATH
  ): ProfileManager {
    if (!ProfileManager.INSTANCE) {
      ProfileManager.INSTANCE = new ProfileManager(root);
    }
    return ProfileManager.INSTANCE;
  }

  public createProfile(name: string, uuid: string): void {
    const profileTemplate: IProfileTemplate = super.load();
    profileTemplate.profiles.push({
      name,
      uuid,
      createTime: new Date().getTime()
    });
    super.save(profileTemplate);
  }

  public buildProfilePath(profileName: string): string {
    const uuid: string = !this.getLastUsed
      ? Config.APP_UUID
      : faker.string.uuid();
    this.createProfile(profileName, uuid);
    this.setProfile(uuid);
    return join(this.root, `${uuid}.toml`);
  }

  public getNameById(uuid: string): string {
    for (const profile of this.content.profiles) {
      if (uuid === profile.uuid) {
        return profile.name;
      }
    }
    return 'null';
  }

  public getFilePathById(uuid: string): string {
    for (const profile of this.content.profiles) {
      if (uuid === profile.uuid) {
        return join(this.root, `${uuid}.toml`);
      }
    }
    return 'null';
  }

  public setProfile(uuid: string): void {
    const profileTemplate: IProfileTemplate = this.load();
    profileTemplate.lastUsed = uuid;
    this.content = profileTemplate;
    super.save(profileTemplate);
  }

  public delete(): void {
    fs.rmSync(join(this.root, '../'), {
      force: true,
      recursive: true,
      retryDelay: 1000
    });
    InitUnit();
  }
}

export default ProfileManager;

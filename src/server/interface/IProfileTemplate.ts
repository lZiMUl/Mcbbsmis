interface IProfile {
  name: string;
  uuid: string;
  createTime?: number;
}
interface IProfileTemplate {
  lastUsed: string;
  profiles: IProfile[];
}
export default IProfileTemplate;
export type { IProfile };

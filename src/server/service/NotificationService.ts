import axios, { AxiosInstance } from 'axios';

interface IUserBaseInfo {
  roomId: number;
  userName: string;
  userId: number;
}

interface INotificationPayload extends IUserBaseInfo {
  timestamp: number;
}

class NotificationService {
  private readonly axios: AxiosInstance;
  private readonly url: string;

  public constructor(baseUrl: string, url: string) {
    this.axios = axios.create({
      baseURL: baseUrl
    });
    this.url = url;
  }
  public async notifications({
    roomId,
    userName,
    userId
  }: IUserBaseInfo): Promise<void> {
    const payload: INotificationPayload = {
      roomId,
      userName,
      userId,
      timestamp: Date.now()
    };

    await this.axios.post(this.url, payload);
  }
}

export default NotificationService;

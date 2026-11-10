import axios from 'axios';
interface IBuvidResponse {
  code: number;
  data: {
    buvid: string;
  };
}

export async function getBuvid(): Promise<string> {
  const { data } = await axios.request<IBuvidResponse>({
    url: 'https://api.bilibili.com/x/web-frontend/getbuvid',
    method: 'GET'
  });
  const { buvid } = data.data;
  return buvid;
}

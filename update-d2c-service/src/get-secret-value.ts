import axios from 'axios';

export async function getSecretValue(
  name: string,
  baseUrl: string,
  auth: {
    username?: string;
    password?: string;
  },
) {
  const axiosInstance = axios.create({
    baseURL: baseUrl,
    auth: auth as { username: string; password: string },
  });

  const { data: secret } = await axiosInstance.get<{
    key: string;
    value: string;
  }>(`/${name}`);

  return secret.value;
}

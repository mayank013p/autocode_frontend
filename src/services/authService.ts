import api from './api';

export const authService = {
  async login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async register(name: string, email: string, password: string) {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },

  async githubLogin(accessToken?: string, code?: string) {
    const response = await api.post('/auth/github', { accessToken, code });
    return response.data;
  },
};

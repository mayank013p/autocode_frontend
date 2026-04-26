import api from './api';

export const dashboardService = {
  getSummary: async () => {
    const res = await api.get('/analytics/summary');
    return res.data;
  },
  getActivity: async () => {
    const res = await api.get('/analytics/activity');
    return res.data;
  },
  getTopics: async () => {
    const res = await api.get('/analytics/topics');
    return res.data;
  },
  getRecentNotes: async () => {
    const res = await api.get('/notes?topic=all&difficulty=all&search=');
    return res.data;
  },
  getNotes: async (topic = 'all', difficulty = 'all', search = '') => {
    const res = await api.get(`/notes?topic=${topic}&difficulty=${difficulty}&search=${search}`);
    return res.data;
  },
  getInsights: async () => {
    const res = await api.get('/analytics/insights');
    return res.data;
  }
};

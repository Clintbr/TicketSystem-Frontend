import api from './axios';

export const statsApi = {
    getDashboardStats: async () => {
        const response = await api.get('/admin/stats');
        return response.data;
    },
    getTicketHistory: async () => {
        const response = await api.get('/admin/stats/history');
        return response.data;
    }
};
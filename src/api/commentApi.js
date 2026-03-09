import api from './axios';

export const commentApi = {
    // GET /api/tickets/{ticketId}/comments
    getComments: async (ticketId) => {
        const response = await api.get(`/tickets/${ticketId}/comments`);
        return response.data;
    },
    // POST /api/tickets/{ticketId}/comments
    addComment: async (ticketId, content) => {
        const response = await api.post(`/tickets/${ticketId}/comments`, { content });
        return response.data;
    },
    // DELETE /api/comments/{commentId}
    deleteComment: async (commentId) => {
        await api.delete(`/comments/${commentId}`);
    }
};
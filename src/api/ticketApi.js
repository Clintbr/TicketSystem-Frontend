import api from './axios';

export const ticketApi = {
    // POST /api/tickets
    create: async (ticketData) => {
        const response = await api.post('/tickets', ticketData);
        return response.data;
    },
    // GET /api/tickets/my
    getMyTickets: async () => {
        const response = await api.get('/tickets/my');
        return response.data;
    },
    // GET /api/tickets (Alle Tickets für Support/Admin)
    getAllTickets: async () => {
        const response = await api.get('/tickets');
        return response.data;
    },
    // GET /api/tickets/assigned
    getAssignedToMe: async () => {
        const response = await api.get('/tickets/assigned');
        return response.data;
    },
    // PATCH /api/tickets/{id}/assign/{supportUserId}
    assignToSupport: async (ticketId, supportUserId) => {
        const response = await api.patch(`/tickets/${ticketId}/assign/${supportUserId}`);
        return response.data;
    },
    // PATCH /api/tickets/{id}/assign/{supportUserId}
    unassignTicket: async (ticketId) => {
        const response = await api.patch(`/tickets/${ticketId}/unassign`);
        return response.data;
    },
    // GET /api/tickets/{id}
    getById: async (id) => {
        const response = await api.get(`/tickets/${id}`);
        return response.data;
    },
    // PATCH /api/tickets/{id}/status
    updateStatus: async (id, status) => {
        const response = await api.patch(`/tickets/${id}/status`, { status });
        return response.data;
    },
    // PATCH /api/tickets/{id}/priority
    updatePriority: async (id, newPrio) => {
        const response = await api.patch(`/tickets/${id}/priority`, null, {
            params: { newPrio }
        });
        return response.data;
    },
    // DELETE /api/tickets/{id}
    delete: async (id) => {
        const response = await api.delete(`/tickets/${id}`);
        return response.data;
    }
};
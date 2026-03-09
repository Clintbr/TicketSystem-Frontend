import api from './axios';

export const userApi = {
    // GET /api/users
    getAllUsers: async () => {
        const response = await api.get('/users');
        return response.data;
    },

    // PATCH /api/users/{id}/role?newRole=ADMIN
    updateRole: async (userId, newRole) => {
        const response = await api.patch(`/users/${userId}/role`, null, {
            params: { newRole }
        });
        return response.data;
    },

    // DELETE /api/users/{id}
    deleteUser: async (userId) => {
        await api.delete(`/users/${userId}`);
    }
};
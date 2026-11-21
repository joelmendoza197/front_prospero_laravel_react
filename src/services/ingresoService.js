import api from '../api/axios';

export const ingresoService = {
    getAll:  ()           => api.get('/ingresos'),
    create:  (data)       => api.post('/ingresos', data),
    update:  (id, data)   => api.put(`/ingresos/${id}`, data),
    delete:  (id)         => api.delete(`/ingresos/${id}`),
};
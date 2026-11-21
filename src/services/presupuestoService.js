// src/services/presupuestoService.js
import api from '../api/axios';

export const presupuestoService = {
    getByMes:     (mes)               => api.get(`/presupuestos?mes=${mes}`),
    create:       (data)              => api.post('/presupuestos', data),
    update:       (id, data)          => api.put(`/presupuestos/${id}`, data),
    delete:       (id)                => api.delete(`/presupuestos/${id}`),
    createItem:   (id, data)          => api.post(`/presupuestos/${id}/items`, data),
    updateItem:   (id, itemId, data)  => api.put(`/presupuestos/${id}/items/${itemId}`, data),
    deleteItem:   (id, itemId)        => api.delete(`/presupuestos/${id}/items/${itemId}`),
};
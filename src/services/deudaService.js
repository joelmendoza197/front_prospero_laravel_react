import api from '../api/axios';

export const deudaService = {
    getAll:         ()                    => api.get('/deudas'),
    create:         (data)                => api.post('/deudas', data),
    update:         (id, data)            => api.put(`/deudas/${id}`, data),
    delete:         (id)                  => api.delete(`/deudas/${id}`),
    registrarPago:  (id, data)            => api.post(`/deudas/${id}/pagos`, data),
    eliminarPago:   (id, numeroCuota)     => api.delete(`/deudas/${id}/pagos/${numeroCuota}`),
};
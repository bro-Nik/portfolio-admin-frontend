import { apiService } from '/app/src/services/api';
import { authService } from '/app/src/services/auth';

const { getValidToken } = authService();
const baseUrl = `${process.env.REACT_APP_MARKET_SERVICE_URL}/admin/api-services`;
const api = apiService(baseUrl, getValidToken, true);

export const servicesApi = {
  getServices() {
    return api.get('/');
  },

  createService(serviceData) {
    return api.post('/', serviceData);
  },

  updateService(serviceId, serviceData) {
    return api.put(`/${serviceId}`, serviceData);
  },

  deleteService(serviceId) {
    return api.del(`/${serviceId}`);
  },

  resetCountersServices(serviceId) {
    return api.post(`/${serviceId}/reset-counters`);
  },

  getServiceLogs(serviceId) {
    return api.get(`/${serviceId}/logs?hours=24&limit=20`);
  },

  getServiceStats(serviceId) {
    return api.get(`/${serviceId}/stats`);
  },

  getServicePresets() {
    return api.get(`/presets/default`);
  },
};

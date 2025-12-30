import { apiService } from '/app/src/services/api';
import { authService } from '/app/src/services/auth';

const { getValidToken } = authService();
const baseUrl = `${process.env.REACT_APP_MARKET_SERVICE_URL}/admin/providers`;
const api = apiService(baseUrl, getValidToken, true);

export const providersApi = {
  getProviders() {
    return api.get('/');
  },

  createProvider(providerData) {
    return api.post('/', providerData);
  },

  updateProvider(providerId, providerData) {
    return api.put(`/${providerId}`, providerData);
  },

  deleteProvider(providerId) {
    return api.del(`/${providerId}`);
  },

  resetCountersProvider(providerId) {
    return api.post(`/${providerId}/reset-counters`);
  },

  getProviderLogs(providerId) {
    return api.get(`/${providerId}/logs?hours=24&limit=20`);
  },

  getProviderStats(providerId) {
    return api.get(`/${providerId}/stats`);
  },

  getProvidersWithPresets() {
    return api.get('/presets/default');
  },

  getProvidersWithMethods() {
    return api.get('/services/with/methods');
  },
};

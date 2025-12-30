import { apiService } from '/app/src/services/api';
import { authService } from '/app/src/services/auth';

const { getValidToken } = authService();
const baseUrl = `${process.env.REACT_APP_MARKET_SERVICE_URL}/admin/tasks`;
const api = apiService(baseUrl, getValidToken, true);

export const tasksApi = {
  // Управление задачами
  getTasks() {
    return api.get('/');
  },

  createTask(taskData) {
    return api.post('/', taskData);
  },

  updateTask(taskId, taskData) {
    return api.put(`/${taskId}`, taskData);
  },

  deleteTask(taskId) {
    return api.del(`/${taskId}`);
  },

  runTask(taskId) {
    return api.post(`/run/`, { taskId });
  },

  scheduleTask(taskId) {
    return api.post(`/schedule/`, { taskId });
  },

  // Получение статуса задач
  getTaskStatus(taskId) {
    return api.get(`/task/${taskId}/status/`);
  },

  getActiveTasks() {
    return api.get(`/celery/active/`);
  },

  getScheduledTasks() {
    return api.get(`/celery/scheduled/`);
  },

  // Получение данных
  getPrices(coinIds = ['bitcoin', 'ethereum']) {
    return api.get(`/prices/?coin_ids=${coinIds.join(',')}`);
  },
}

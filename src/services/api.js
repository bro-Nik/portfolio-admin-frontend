export const apiService = (baseUrl = '', getToken, convert = false) => {

  const getAuthHeaders = async () => {
    if (!getToken) return {};
    
    const token = await getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const request = async (url, options = {}) => {
    const fullUrl = `${baseUrl}${url}`;
    try {
      const response = await fetch(fullUrl, {
        headers: {
          'Content-Type': 'application/json',
          ... await getAuthHeaders(),
        },
        ...options,
      });

      let data = await response.json().catch(() => null);
      data = snakeToCamel(data);

      if (!response.ok) {
        throw data?.detail || 'Request failed';
      }
      console.log('Запрос завершен, ', fullUrl)
      return { success: true, data };
    } catch (error) {
      console.log(error)
      const normalizedError = normalizeError(error);
      console.log('Ошибка запроса, ', fullUrl, normalizedError)
      // return { success: false, error: 'Ошибка сети' };
      throw normalizedError;
    }
  };

  const get = (url) => {
    return request(url);
  };

  const post = (url, body) => {
    console.log(convert)
    return request(url, {
      method: 'POST',
      body: JSON.stringify(convert ? camelToSnake(body) : body),
    });
  };

  const put = (url, body) => {
    return request(url, {
      method: 'PUT',
      body: JSON.stringify(convert ? camelToSnake(body) : body),
    });
  };

  const del = (url) => {
    return request(url, {
      method: 'DELETE',
    });
  };

  return { get, post, put, del };
};

const snakeToCamel = (obj) => {
  if (obj === undefined || obj === null) return obj;

  if (Array.isArray(obj)) {
    return obj.map(v => snakeToCamel(v));
  } else if (obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = snakeToCamel(obj[key]);
      return result;
    }, {});
  }
  return obj;
};

const camelToSnake = (obj) => {
  if (obj === undefined || obj === null) return obj;

  if (Array.isArray(obj)) {
    return obj.map(v => camelToSnake(v));
  } else if (obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const snakeKey = key.replace(/([A-Z])/g, (_, letter) => `_${letter.toLowerCase()}`);
      result[snakeKey] = camelToSnake(obj[key]);
      return result;
    }, {});
  }
  return obj;
};

const normalizeError = (error) => {
  // Создаем стандартный объект ошибки
  const normalized = {
    message: '',
  };
  
  if (error.response) {
    normalized.message = error.response.data?.message || `Ошибка ${error.response.status}`;
  } else if (error.request) {
    normalized.message = 'Нет ответа от сервера';
  } else {
    normalized.message = error || 'Неизвестная ошибка';
  }
  
  return normalized;
}

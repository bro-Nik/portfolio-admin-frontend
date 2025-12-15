import { apiService } from './api';
import { getToken, getRefreshToken, setTokens, decodeToken, isTokenExpired } from './token';

export const authService = () => {
  const api = apiService(process.env.REACT_APP_AUTH_SERVICE_URL);

  const getCurrentUser = async () => {
    const token = await getValidToken();
    let decodedToken = decodeToken(token);
    if (!decodedToken) return;

    return {
      id: decodedToken.sub,
      login: decodedToken.login,
      roles: decodedToken.roles,
    }
  };

  const getValidToken = async () => {
    let token = getToken();
    let decodedToken = decodeToken(token);
    if (!decodedToken) return;

    // Если токен просрочен, пытаемся обновить
    if (isTokenExpired(decodedToken)) {
      token = await refreshTokens();
      decodedToken = decodeToken(token);
      if (!decodedToken) return;
    }
    return token;
  };

  const setTokensFromResponse = (data) => {
    const { accessToken, refreshToken } = data;
    setTokens(accessToken, refreshToken);
  };

  const refreshTokens = async () => {
    const token = getRefreshToken();
    if (!token) throw new Error('No refresh token');

    const result = await api.post('/refresh', { token });
    if (result.success) {
      setTokensFromResponse(result.data);
      return result.data.accessToken;
    }
  };

  return {
    refreshTokens,
    getCurrentUser,
    getValidToken
  };
};

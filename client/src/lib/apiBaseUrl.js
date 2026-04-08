export const getApiBaseUrl = () => {
  const envUrl = typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL;
  if (typeof envUrl === 'string' && envUrl.trim().length > 0) {
    const normalized = envUrl.trim().replace(/\/?api\/?$/, '').replace(/\/$/, '');
    return normalized;
  }

  if (typeof window === 'undefined') {
    return 'http://localhost:5000';
  }

  const host = window.location.hostname;
  const origin = window.location.origin.replace(/\/$/, '');

  if (host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0') {
    return `${window.location.protocol}//localhost:5000`;
  }

  console.warn('VITE_API_BASE_URL is not set. Using browser origin as API base:', origin);
  return origin;
};

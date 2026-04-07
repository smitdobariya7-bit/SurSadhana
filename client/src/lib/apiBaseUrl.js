export const getApiBaseUrl = () => {
  const envUrl = typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL;
  if (typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl.replace(/\/$/, '');
  }

  if (typeof window === 'undefined') {
    return 'http://localhost:5000';
  }

  const host = window.location.hostname;
  const origin = window.location.origin.replace(/\/$/, '');

  if (host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0') {
    return `${window.location.protocol}//localhost:5000`;
  }

  return origin;
};

export const getApiBaseUrlError = () => {
  const envUrl = typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL;

  if (typeof window === 'undefined') {
    return null;
  }

  const host = window.location.hostname;
  const isLocalhost = host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0';

  if (!envUrl && !isLocalhost) {
    return 'Missing backend configuration: set VITE_API_BASE_URL in your Netlify environment variables to your deployed backend URL.';
  }

  return null;
};

import { useState, useCallback, useEffect } from 'react';
import type { ApiConfig } from '../types/apiConfig';
import { DEFAULT_API_CONFIG, API_CONFIG_STORAGE_KEY } from '../types/apiConfig';

function loadConfig(): ApiConfig {
  try {
    const raw = localStorage.getItem(API_CONFIG_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ApiConfig;
  } catch {
    // ignore
  }
  return DEFAULT_API_CONFIG;
}

export function useApiConfig() {
  const [config, setConfig] = useState<ApiConfig>(loadConfig);

  useEffect(() => {
    localStorage.setItem(API_CONFIG_STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  const updateConfig = useCallback(<K extends keyof ApiConfig>(key: K, value: ApiConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetConfig = useCallback(() => {
    localStorage.removeItem(API_CONFIG_STORAGE_KEY);
    setConfig(DEFAULT_API_CONFIG);
  }, []);

  return { config, updateConfig, resetConfig };
}

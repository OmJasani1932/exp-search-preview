import { useState, useCallback } from 'react';
import type { SearchPayload } from '../types/searchPayload';
import { EMPTY_PAYLOAD, LOCAL_STORAGE_KEY, PAYLOAD_VERSION } from '../constants/defaultPayload';

const VERSION_KEY = 'search_debugger_payload_version';

function loadFromStorage(): SearchPayload {
  try {
    const storedVersion = Number(localStorage.getItem(VERSION_KEY) ?? '0');
    if (storedVersion < PAYLOAD_VERSION) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      localStorage.setItem(VERSION_KEY, String(PAYLOAD_VERSION));
      return EMPTY_PAYLOAD;
    }
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const stored = JSON.parse(raw) as Partial<SearchPayload>;
      return { ...EMPTY_PAYLOAD, ...stored };
    }
  } catch {
    // ignore
  }
  return EMPTY_PAYLOAD;
}

export function useSearchPayload() {
  const [payload, setPayload] = useState<SearchPayload>(loadFromStorage);
  const [jsonText, setJsonText] = useState<string>(() => JSON.stringify(loadFromStorage(), null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0);

  // Keep jsonText in sync with payload (for display only — NOT auto-saved)
  const syncJsonFromPayload = useCallback((p: SearchPayload) => {
    setJsonText(JSON.stringify(p, null, 2));
    setJsonError(null);
  }, []);

  const updatePayload = useCallback(<K extends keyof SearchPayload>(key: K, value: SearchPayload[K]) => {
    setPayload((prev) => {
      const next = { ...prev, [key]: value };
      syncJsonFromPayload(next);
      return next;
    });
  }, [syncJsonFromPayload]);

  const updateFromJson = useCallback((text: string) => {
    setJsonText(text);
    try {
      const parsed = JSON.parse(text) as SearchPayload;
      setPayload(parsed);
      setJsonError(null);
    } catch (e) {
      setJsonError((e as Error).message);
    }
  }, []);

  /** Persist current payload to localStorage */
  const savePayload = useCallback(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
    localStorage.setItem(VERSION_KEY, String(PAYLOAD_VERSION));
  }, [payload]);

  const resetToDefault = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setPayload(EMPTY_PAYLOAD);
    setJsonText(JSON.stringify(EMPTY_PAYLOAD, null, 2));
    setJsonError(null);
    setResetKey((k) => k + 1);
  }, []);

  return { payload, jsonText, jsonError, resetKey, updatePayload, updateFromJson, savePayload, resetToDefault };
}

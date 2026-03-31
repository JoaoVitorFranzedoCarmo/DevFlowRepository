// src/hooks/useApi.js

import { useState, useEffect, useCallback } from "react";

export function useApi(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || "Erro ao carregar dados");
      throw err;
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    execute();
  }, [execute]);

  const refetch = useCallback(() => execute(), [execute]);

  return { data, loading, error, refetch, setData };
}

export function useLazyApi(fetchFn) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || "Erro na operação");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  return { data, loading, error, execute, setData };
}

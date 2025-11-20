import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

/**
 * Custom hook for API calls with loading and error states
 * @param {Function} apiFunc - The async function that makes the API call
 * @returns {Object} - { data, loading, error, execute }
 */
export const useApi = (apiFunc) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...params) => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiFunc(...params);
        setData(result);
        return result;
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'An error occurred');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunc]
  );

  return { data, loading, error, execute };
};

/**
 * Custom hook for debouncing values
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {any} - The debounced value
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Custom hook for intersection observer (lazy loading)
 * @param {Object} options - IntersectionObserver options
 * @returns {Array} - [ref, isIntersecting]
 */
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [node, setNode] = useState(null);

  const observer = useCallback(
    (node) => {
      if (node) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            setIsIntersecting(entry.isIntersecting);
          },
          options
        );
        observer.observe(node);
        return () => observer.disconnect();
      }
    },
    [options]
  );

  useEffect(() => {
    if (node) {
      return observer(node);
    }
  }, [node, observer]);

  return [setNode, isIntersecting];
};

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSnackbar } from 'notistack';

/**
 * Unified Dashboard Hook
 * Provides automatic data refresh, error handling, and loading states
 * for all dashboard types
 * 
 * @param {Function} fetchFunction - Function that fetches dashboard data
 * @param {Object} options - Configuration options
 * @param {number} options.refreshInterval - Auto-refresh interval in milliseconds (default: 30000 = 30s)
 * @param {boolean} options.autoRefresh - Enable/disable auto-refresh (default: true)
 * @param {boolean} options.showErrorNotification - Show error notifications (default: true)
 * @param {Array} options.dependencies - Additional dependencies for refresh
 */
const useDashboard = (fetchFunction, options = {}) => {
  const {
    refreshInterval = 30000, // 30 seconds default
    autoRefresh = true,
    showErrorNotification = true,
    dependencies = [],
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const intervalRef = useRef(null);
  const mountedRef = useRef(true);

  const fetchData = useCallback(
    async (silent = false) => {
      try {
        console.log('🚀 useDashboard fetchData: Starting fetch, silent=', silent);
        if (!silent) setLoading(true);
        setError(null);

        const result = await fetchFunction();
        console.log('📦 useDashboard fetchData: Fetch completed, result=', result);
        console.log('🔍 useDashboard fetchData: mountedRef.current=', mountedRef.current);

        if (mountedRef.current) {
          console.log('🎯 useDashboard: Setting data to:', result);
          console.log('🎯 useDashboard: result.courses length:', result?.courses?.length);
          setData(result);
          setLastUpdated(new Date());
          console.log('✅ useDashboard: Data set successfully');
        } else {
          console.log('⚠️ useDashboard: Component unmounted, not setting data');
        }
      } catch (err) {
        console.error('❌ useDashboard fetchData: Error caught:', err);
        console.error('Dashboard fetch error:', err);
        if (mountedRef.current) {
          setError(err);
          if (showErrorNotification && !silent) {
            enqueueSnackbar(
              err.response?.data?.message || 'Failed to load dashboard data',
              { variant: 'error' }
            );
          }
        }
      } finally {
        console.log('🏁 useDashboard fetchData: Finally block, mountedRef.current=', mountedRef.current);
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    },
    [fetchFunction, showErrorNotification, enqueueSnackbar]
  );

  // Initial fetch and mount/unmount tracking
  useEffect(() => {
    mountedRef.current = true; // Set to true on mount/remount
    fetchData();
    
    return () => {
      mountedRef.current = false; // Set to false only on final unmount
    };
  }, [fetchData, ...dependencies]);

  // Auto-refresh setup
  useEffect(() => {
    if (!autoRefresh || refreshInterval <= 0) return;

    intervalRef.current = setInterval(() => {
      fetchData(true); // Silent refresh
    }, refreshInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoRefresh, refreshInterval, fetchData]);

  const refresh = useCallback(() => {
    fetchData(false);
  }, [fetchData]);

  const silentRefresh = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh,
    silentRefresh,
  };
};

export default useDashboard;

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Empty string = relative path, so requests go through nginx on the same
// origin (which proxies /api/ to the backend). Only set VITE_API_URL if the
// backend is genuinely hosted on a different domain.
const API_URL = import.meta.env.VITE_API_URL ?? '';

export const useSalesData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_URL}/api/data?reportType=ProductDateWiseSale`);
      
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      
      setData(response.data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchData, 60000);
    
    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, loading, error, lastUpdated, refetch: fetchData };
};

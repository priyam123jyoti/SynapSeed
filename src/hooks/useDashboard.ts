'use client';

import { useEffect, useState } from 'react';
import { DashboardResponse } from '@/types/dashboard';

export default function useDashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  async function fetchDashboard() {
    try {
      setLoading(true);

      const res = await fetch('/api/dashboard');

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error);
      }

      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboard();
  }, []);

  return {
    data,
    loading,
    error,
    refresh: fetchDashboard,
  };
}
// hooks/useProfile.ts
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      // 1. Get the current active session
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      // 2. Pull the data from your 'profiles' table
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (data) setProfile(data);
    } catch (err) {
      console.error("Neural Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();

    /**
     * REAL-TIME SYNC: 
     * This listener waits for ANY change in the database.
     * If you update your bio or username, this hook will 
     * automatically re-fetch the data.
     */
    const profileSubscription = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        () => fetchProfile()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(profileSubscription);
    };
  }, []);

  return { profile, loading, refresh: fetchProfile };
}
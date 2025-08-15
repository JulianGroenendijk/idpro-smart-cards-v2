import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('idpro_token');
    const userData = localStorage.getItem('idpro_user');
    
    if (!token) {
      router.push('/auth/login');
      return;
    }
    
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    setLoading(false);
  }, [router]);

  const logout = () => {
    localStorage.removeItem('idpro_token');
    localStorage.removeItem('idpro_user');
    router.push('/auth/login');
  };

  return { user, loading, logout };
};

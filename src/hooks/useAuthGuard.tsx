// hooks/useAuthGuard.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // or 'next/router' for Pages Router
import { getToken, isTokenExpired, clearToken } from '@/lib/auth';

export function useAuthGuard() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = getToken(); // ← use a different name, not "token"

    if (!storedToken || isTokenExpired(storedToken)) {
      clearToken();
      router.replace('/auth/login');
      return; 
    }

    setToken(storedToken); 
    setIsAuth(true);
  
  }, []);

  return { isAuth, token };
}
"use client";

import User from '@/networkApi/user';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const withAuth = (WrappedComponent) => {
  return function AuthComponent(props) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const checkAuth = () => {
        const token = User.getAccessToken();
        
        if (!token) {
          router.replace('/');
        } else {
          setIsAuthenticated(true);
        }
      };

      checkAuth();
    }, [router]);

    if (!isAuthenticated) {
      return null; 
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
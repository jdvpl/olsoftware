'use client';
import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/common/Header'; 

export default function MainLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return <div>Cargando...</div>; 
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header userName={user?.name || ''} userRole={user?.role || ''} />
      <main className="flex-grow container mx-auto p-4">
        {children}
      </main>
    </div>
  );
}
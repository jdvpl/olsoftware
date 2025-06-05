'use client';
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface HeaderProps {
  userName: string;
  userRole: string;
}

const Header: React.FC<HeaderProps> = ({ userName, userRole }) => {
  const { logout } = useAuth();

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/home" className="text-xl font-bold">
          OLSoftware - Comerciantes
        </Link>
        <nav className="flex items-center space-x-4">
             <Link href="/merchants/new" className="hover:text-gray-300">Crear Comerciante</Link>
        </nav>
        <div className="flex items-center">
          <span className="mr-4">
            ¡Bienvenido! {userName} ({userRole})
          </span>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
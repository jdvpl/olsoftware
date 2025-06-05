'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import {
  UserCircleIcon,
  ArrowRightStartOnRectangleIcon,
  HandThumbUpIcon,
} from '@heroicons/react/24/solid';

interface HeaderProps {
  userName: string;
  userRole: string;
}

const Header: React.FC<HeaderProps> = ({ userName, userRole }) => {
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cierra el menú si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-md p-4">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link href="/home" className="flex items-center gap-2 text-lg sm:text-xl font-bold text-gray-800">
          <Image src="/logo.png" alt="logo" width={40} height={40} />
          OLSoftware
        </Link>

        <nav className="flex items-center justify-between gap-4 text-sm sm:text-base text-gray-700">
          <Link href="/home" className="hover:text-blue-600 flex gap-x-2 transition-colors">
            <div className="rounded-full w-6 text-center bg-gray-400 text-white"> 1</div> Lista formulario
          </Link>
          <span className="text-gray-300 hidden sm:inline">|</span>
          <Link href="/merchants/new" className="hover:text-blue-600 flex gap-x-3 transition-colors">
            <div className="rounded-full w-6 text-center bg-blue-400 text-white"> 2</div> Crear Comerciante
          </Link>

          <div className='flex gap-x-5 ml-5'>
            <div className='rounded-full bg-amber-950 text-white'>
              <HandThumbUpIcon className='w-6 p-1' />
            </div>
            <span className="tracking-wider font-bold ">Beneficios por renovar</span>
          </div>
        </nav>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-700"
          >
            <UserCircleIcon className="w-8 h-8" />
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold">{userName}</p>
              <p className="text-xs text-gray-500">{userRole}</p>
            </div>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border z-50">
              <button
                onClick={logout}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

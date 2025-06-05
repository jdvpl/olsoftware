'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!termsAccepted) {
      setError('Debes aceptar los términos y condiciones.');
      return;
    }

    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        login(response.data.data.access_token, response.data.data.user);
      } else {
        setError(response.data.message || 'Error en el inicio de sesión.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error de conexión o credenciales inválidas.');
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2">OLSoftware</h1>
        <p className="text-center text-gray-600 mb-6">
          Debes iniciar sesión para acceder a la plataforma
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="usuario@example.com"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="********"
            />
          </div>
          <div className="mb-6">
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                Acepto términos y condiciones
              </label>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            disabled={!termsAccepted}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              termsAccepted
                ? 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Iniciar sesión
          </button>
        </form>
      </div>
      <div className="mt-4 text-center text-sm text-gray-500">
        Beneficios por renovar (Este es un texto de ejemplo)
      </div>
    </div>
  );
};

export default LoginForm;
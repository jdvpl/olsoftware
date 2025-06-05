
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';
import { Merchant, PaginatedMerchantsResponse } from '@/types/merchant';
import MerchantTable from '@/components/merchants/MerchantTable';
import Pagination from '@/components/common/Pagination';

const HomePage = () => {
  const { user } = useAuth();
  const [merchantsResponse, setMerchantsResponse] = useState<PaginatedMerchantsResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); 
  const [filters, setFilters] = useState({ business_name: '', registration_date: '', status: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMerchants = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });
      if (filters.business_name) params.append('business_name', filters.business_name);
      if (filters.registration_date) params.append('registration_date', filters.registration_date);
      if (filters.status) params.append('status', filters.status);
      
      const response = await api.get<any>(`/comerciantes?${params.toString()}`);
      if (response.data.success) {
      
        const merchantsWithCount = response.data.data.items.map((m: Merchant) => ({
          ...m,
          establishment_count: m.total_establishments || 0, 
        }));
        setMerchantsResponse({ ...response.data.data, items: merchantsWithCount });
      } else {
        setError(response.data.message || 'Error al cargar comerciantes');
      }
    } catch (err) {
      setError('Error de conexión al cargar comerciantes.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage, filters]);

  useEffect(() => {
    fetchMerchants();
  }, [fetchMerchants]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (limit: number) => {
    setItemsPerPage(limit);
    setCurrentPage(1); 
  };
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const applyFilters = () => {
    setCurrentPage(1);
    fetchMerchants();
  };

  const handleDownloadReport = async () => {
    try {
      const response = await api.get('/comerciantes/reporte/csv', {
        responseType: 'blob', 
      });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'comerciantes_activos.csv';
      link.click();
      window.URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error('Error al descargar el reporte:', err);
      alert('Error al descargar el reporte.');
    }
  };

  if (isLoading && !merchantsResponse) return <p className="text-center mt-8">Cargando comerciantes...</p>;
  if (error) return <p className="text-center text-red-500 mt-8">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Lista Formularios Creados (Comerciantes)</h1>
        <div>
          {user?.role === 'ADMIN' && (
            <button
              onClick={handleDownloadReport}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Descargar Reporte en CSV
            </button>
          )}
          <Link href="/merchants/new">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Crear Formulario (Nuevo)
            </button>
          </Link>
        </div>
      </div>

      <div className="mb-4 p-4 border rounded-md bg-gray-50">
        <h3 className="text-lg font-medium mb-2">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            name="business_name"
            placeholder="Nombre o Razón Social"
            value={filters.business_name}
            onChange={handleFilterChange}
            className="p-2 border rounded-md"
          />
          <input
            type="date"
            name="registration_date"
            placeholder="Fecha de Registro"
            value={filters.registration_date}
            onChange={handleFilterChange}
            className="p-2 border rounded-md"
          />
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="p-2 border rounded-md"
          >
            <option value="">Todos los Estados</option>
            <option value="ACTIVE">Activo</option>
            <option value="INACTIVE">Inactivo</option>
          </select>
          <button
            onClick={applyFilters}
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>


      {merchantsResponse && merchantsResponse.items.length > 0 ? (
        <>
          <MerchantTable
            merchants={merchantsResponse.items}
            onRefresh={fetchMerchants}
            currentUserRole={user?.role || ''}
          />
          <Pagination
            currentPage={merchantsResponse.currentPage}
            totalPages={merchantsResponse.totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
            allowedLimits={[5, 10, 15]} 
          />
        </>
      ) : (
        !isLoading && <p className="text-center mt-8">No se encontraron comerciantes.</p>
      )}
    </div>
  );
};

export default HomePage;
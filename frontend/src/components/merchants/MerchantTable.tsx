'use client';
import React from 'react';
import Link from 'next/link';
import { Merchant } from '@/types/merchant';
import api from '@/services/api';
import {  PencilIcon, TrashIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';


interface MerchantTableProps {
  merchants: Merchant[];
  onRefresh: () => void;
  currentUserRole: string;
}

const MerchantTable: React.FC<MerchantTableProps> = ({ merchants, onRefresh, currentUserRole }) => {

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este comerciante?')) {
      try {
        await api.delete(`/comerciantes/${id}`);
        alert('Comerciante eliminado exitosamente.');
        onRefresh();
      } catch (error) {
        console.error('Error al eliminar comerciante:', error);
        alert('Error al eliminar comerciante.');
      }
    }
  };

  const handleChangeStatus = async (id: number, currentStatus: 'ACTIVE' | 'INACTIVE') => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const action = newStatus === 'ACTIVE' ? 'activar' : 'inactivar';
    if (window.confirm(`¿Estás seguro de que deseas ${action} este comerciante?`)) {
      try {
        await api.patch(`/comerciantes/${id}/estado`, { status: newStatus });
        alert(`Comerciante ${action}do exitosamente.`);
        onRefresh();
      } catch (error) {
        console.error(`Error al ${action} comerciante:`, error);
        alert(`Error al ${action} comerciante.`);
      }
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Nombre o Razón Social</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Teléfono</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Correo Electrónico</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Fecha Registro</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">No. Estab.</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Estado</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {merchants.map((merchant) => (
            <tr key={merchant.id_merchant} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2 text-sm">{merchant.business_name}</td>
              <td className="px-4 py-2 text-sm">{merchant.phone || '-'}</td>
              <td className="px-4 py-2 text-sm">{merchant.optional_email || '-'}</td>
              <td className="px-4 py-2 text-sm">{formatDate(merchant.registration_date)}</td>
              <td className="px-4 py-2 text-sm text-center">{merchant.establishment_count ?? 0}</td>
              <td className="px-4 py-2 text-sm">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    merchant.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {merchant.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="px-4 py-2 text-sm">
                <div className="flex space-x-1">
                  <Link href={`/merchants/${merchant.id_merchant}/edit`} title="Editar">
                    <PencilIcon className="h-5 w-5 text-blue-500 hover:text-blue-700" />
                  </Link>
                  <button
                    onClick={() => handleChangeStatus(merchant.id_merchant, merchant.status)}
                    title={merchant.status === 'ACTIVE' ? 'Inactivar' : 'Activar'}
                  >
                    {merchant.status === 'ACTIVE' ? (
                      <XCircleIcon className="h-5 w-5 text-yellow-500 hover:text-yellow-700" />
                    ) : (
                      <CheckCircleIcon className="h-5 w-5 text-green-500 hover:text-green-700" />
                    )}
                  </button>
                  {currentUserRole === 'ADMIN' && (
                    <button onClick={() => handleDelete(merchant.id_merchant)} title="Eliminar">
                      <TrashIcon className="h-5 w-5 text-red-500 hover:text-red-700" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MerchantTable;
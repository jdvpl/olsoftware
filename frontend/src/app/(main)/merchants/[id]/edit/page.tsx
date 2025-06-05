  'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import MerchantForm from '@/components/merchants/MerchantForm';
import api from '@/services/api';
import { Merchant } from '@/types/merchant';

export default function EditMerchantPage() {
  const params = useParams();
  const id = params.id as string;
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchMerchant = async () => {
        setLoading(true);
        try {
          const response = await api.get(`/comerciantes/${id}`);
          if (response.data.success) {
            setMerchant(response.data.data);
          } else {
            setError(response.data.message || 'Comerciante no encontrado.');
          }
        } catch (err) {
          setError('Error al cargar el comerciante.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchMerchant();
    }
  }, [id]);

  if (loading) return <p className="text-center mt-8">Cargando comerciante...</p>;
  if (error) return <p className="text-red-500 text-center mt-8">{error}</p>;
  if (!merchant) return <p className="text-center mt-8">Comerciante no encontrado.</p>;

  return (
    <div>
      <MerchantForm merchant={merchant} id={id} />
    </div>
  );
}
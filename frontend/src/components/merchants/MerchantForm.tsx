'use client';

import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { Merchant, Municipality, CreateMerchantDto, UpdateMerchantDto } from '@/types/merchant';

interface MerchantFormProps {
  merchant?: Merchant; 
  id?: string;
}

type FormInputs = {
  business_name: string;
  id_municipio: number | string; 
  phone?: string;
  optional_email?: string;
  registration_date: string;
  status: 'ACTIVE' | 'INACTIVE';
  has_establishments: boolean; // ¿Posee establecimientos?
};

const MerchantForm: React.FC<MerchantFormProps> = ({ merchant, id }) => {
  const router = useRouter();
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  const [totalIncome, setTotalIncome] = useState<number | undefined>(merchant?.total_income);
  const [totalEmployees, setTotalEmployees] = useState<number | undefined>(merchant?.total_employees);


  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      business_name: merchant?.business_name || '',
      id_municipio: merchant?.id_municipio || '',
      phone: merchant?.phone || '',
      optional_email: merchant?.optional_email || '',
      registration_date: merchant?.registration_date
        ? new Date(merchant.registration_date).toISOString().split('T')[0]
        : '',
      status: merchant?.status || 'ACTIVE',
      has_establishments: false, 
    },
  });

  useEffect(() => {
    const fetchMunicipalities = async () => {
      try {
        const response = await api.get('/valores/municipios');
        if (response.data.success) {
          setMunicipalities(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching municipalities:', error);
        setFormError('No se pudieron cargar los municipios.');
      }
    };
    fetchMunicipalities();

    if (merchant) {
        if (merchant.total_income !== undefined) setTotalIncome(merchant.total_income);
        if (merchant.total_employees !== undefined) setTotalEmployees(merchant.total_employees);
    }


  }, [merchant]);

  useEffect(() => {
    if (merchant) {
      reset({
        business_name: merchant.business_name,
        id_municipio: merchant.id_municipio || '',
        phone: merchant.phone || '',
        optional_email: merchant.optional_email || '',
        registration_date: merchant.registration_date
          ? new Date(merchant.registration_date).toISOString().split('T')[0]
          : '',
        status: merchant.status,
        has_establishments: false, 
      });
    }
  }, [merchant, reset]);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setIsLoading(true);
    setFormError(null);

    const payload: CreateMerchantDto | UpdateMerchantDto = {
      ...data,
      id_municipio: Number(data.id_municipio), 
      registration_date: new Date(data.registration_date).toISOString().split('T')[0], 
    };


    try {
      if (id && merchant) { 
        const response = await api.put(`/comerciantes/${id}`, payload as UpdateMerchantDto);
        if (response.data.success){
            alert('Comerciante actualizado exitosamente!');
            router.push('/home');
        } else {
            setFormError(response.data.message || 'Error al actualizar.');
        }
      } else { 
        const response = await api.post('/comerciantes', payload as CreateMerchantDto);
        if (response.data.success){
            alert('Comerciante creado exitosamente!');
            router.push('/home');
        } else {
            setFormError(response.data.message || 'Error al crear.');
        }
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setFormError(err.response?.data?.message || 'Ocurrió un error en el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (

    <div className="p-8 bg-white shadow-md rounded-lg max-w-2xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {merchant ? 'Actualizar Comerciante' : 'Crear Nuevo Comerciante'}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="business_name" className="block text-sm font-medium text-gray-700">
            Nombre o Razón Social <span className="text-red-500">*</span>
          </label>
          <input
            {...register('business_name', { required: 'Este campo es obligatorio' })}
            type="text"
            id="business_name"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.business_name && <p className="text-red-500 text-xs mt-1">{errors.business_name.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="id_municipio" className="block text-sm font-medium text-gray-700">
            Municipio <span className="text-red-500">*</span>
          </label>
          <select
            {...register('id_municipio', { required: 'Debe seleccionar un municipio' })}
            id="id_municipio"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            defaultValue=""
          >
            <option value="" disabled>Seleccione un municipio</option>
            {municipalities.map((m) => (
              <option key={m.id_municipio} value={m.id_municipio}>
                {m.nombre}
              </option>
            ))}
          </select>
          {errors.id_municipio && <p className="text-red-500 text-xs mt-1">{errors.id_municipio.message}</p>}
        </div>
        
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono (Opcional)</label>
          <input
            {...register('phone')}
            type="tel"
            id="phone"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="optional_email" className="block text-sm font-medium text-gray-700">Correo Electrónico (Opcional)</label>
          <input
            {...register('optional_email', {
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Formato de correo inválido',
              },
            })}
            type="email"
            id="optional_email"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.optional_email && <p className="text-red-500 text-xs mt-1">{errors.optional_email.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="registration_date" className="block text-sm font-medium text-gray-700">
            Fecha de Registro <span className="text-red-500">*</span>
          </label>
          <input
            {...register('registration_date', { required: 'Este campo es obligatorio' })}
            type="date"
            id="registration_date"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.registration_date && <p className="text-red-500 text-xs mt-1">{errors.registration_date.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Estado <span className="text-red-500">*</span>
          </label>
          <select
            {...register('status', { required: 'Debe seleccionar un estado' })}
            id="status"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="ACTIVE">Activo</option>
            <option value="INACTIVE">Inactivo</option>
          </select>
          {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
        </div>

        <div className="mb-6">
          <div className="flex items-center">
            <Controller
                name="has_establishments"
                control={control}
                render={({ field }) => (
                    <input
                    id="has_establishments"
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                )}
            />
            <label htmlFor="has_establishments" className="ml-2 block text-sm text-gray-900">
              ¿Posee establecimientos?
            </label>
          </div>
        </div>
        
        {formError && <p className="text-red-500 text-sm mb-4 text-center">{formError}</p>}

        <div className="mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
          >
            {isLoading ? 'Guardando...' : (merchant ? 'Actualizar Comerciante' : 'Crear Comerciante')}
          </button>
        </div>
      </form>
      {merchant && (totalIncome !== undefined || totalEmployees !== undefined) && (
         <div className="mt-8 pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Resumen de Establecimientos (Datos de Semilla)</h3>
            <p className="text-sm text-gray-600">
                Total Ingresos: <span className="font-medium">${(totalIncome || 0).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </p>
            <p className="text-sm text-gray-600">
                Cantidad de Empleados: <span className="font-medium">{totalEmployees || 0}</span>
            </p>
            <p className="text-xs text-gray-500 mt-2">
                Nota: Esta información se basa en los establecimientos asociados cargados inicialmente (Reto 3). 
                La gestión de establecimientos no está disponible en esta interfaz.
            </p>
        </div>
      )}
    </div>
  );
};

export default MerchantForm;
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import {
  Merchant,
  Municipality,
  CreateMerchantDto,
  UpdateMerchantDto,
} from '@/types/merchant';

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
  has_establishments: boolean;
};

const MerchantForm: React.FC<MerchantFormProps> = ({ merchant, id }) => {
  const router = useRouter();
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);


  const [totalIncome, setTotalIncome] = useState<number | undefined>(
    merchant?.total_income,
  );
  const [totalEmployees, setTotalEmployees] = useState<number | undefined>(
    merchant?.total_employees,
  );

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
        ? new Date(merchant.registration_date).toISOString().substring(0, 10)
        : '',
      status: merchant?.status || 'ACTIVE',
      has_establishments: !!merchant?.total_establishments && merchant.total_establishments > 0,
    },
  });

  useEffect(() => {
    const fetchMunicipalities = async () => {
      try {
        const { data } = await api.get('/valores/municipios');
        if (data.success) setMunicipalities(data.data);
      } catch {
        setFormError('No se pudieron cargar los municipios.');
      }
    };
    fetchMunicipalities();
  }, []);

  useEffect(() => {
  if (merchant) {
    reset({
      business_name: merchant.business_name,
      id_municipio: merchant.id_municipio || '',
      phone: merchant.phone || '',
      optional_email: merchant.optional_email || '',
      registration_date: merchant.registration_date
        ? new Date(merchant.registration_date).toISOString().substring(0, 10)
        : '',
      status: merchant.status,
      has_establishments:
        !!merchant.total_establishments &&
        merchant.total_establishments > 0,
    });

    const totalIncomeSum = merchant.establishment?.reduce(
      (acc, est) => acc + Number(est.income || 0),
      0,
    );

    
    const totalEmployeesSum = merchant.establishment?.reduce(
      (acc, est) => acc + Number(est.employee_count || 0),
      0,
    );
    setTotalIncome(totalIncomeSum);
    setTotalEmployees(totalEmployeesSum);
  }
}, [merchant, reset]);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setIsLoading(true);
    setFormError(null);

    const payload: CreateMerchantDto | UpdateMerchantDto = {
      ...data,
      id_municipio: Number(data.id_municipio),
      registration_date: new Date(data.registration_date).toISOString(),
    };

    try {
      const url = id && merchant ? `/comerciantes/${id}` : '/comerciantes';
      const method = id && merchant ? api.put : api.post;
      const { data: res } = await method(url, payload);

      if (res.success) {
        alert(
          merchant
            ? 'Comerciante actualizado exitosamente!'
            : 'Comerciante creado exitosamente!',
        );
        router.push('/home');
      } else {
        setFormError(res.message || 'Ocurrió un error.');
      }
    } catch (err: any) {
      setFormError(
        err?.response?.data?.message || 'Ocurrió un error en el servidor.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg max-w-5xl mx-auto mb-24"> 
      <h3 className="border-b border-gray-200 text-blue-700 font-semibold p-5">
        Datos Generales
      </h3>


      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="rounded-lg p-5">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="space-y-4 p-6">
              <div>
                <label
                  htmlFor="business_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Razón Social <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('business_name', {
                    required: 'Este campo es obligatorio',
                    minLength: { value: 3, message: 'Debe tener al menos 3 caracteres' },
                    maxLength: { value: 100, message: 'No puede exceder los 100 caracteres' },
                  })}
                  id="business_name"
                  className="mt-1 block h-8 w-full rounded-md border-gray-300 shadow-sm
                      focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.business_name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.business_name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="id_municipio"
                  className="block text-sm font-medium text-gray-700"
                >
                  Departamento / Municipio <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('id_municipio', {
                    required: 'Debe seleccionar un municipio',
                  })}
                  id="id_municipio"
                  className="mt-1 block h-8 w-full rounded-md border-gray-300 shadow-sm
                             focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Seleccione un municipio
                  </option>
                  {municipalities.map((m) => (
                    <option key={m.id_municipio} value={m.id_municipio}>
                      {m.nombre}
                    </option>
                  ))}
                </select>
                {errors.id_municipio && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.id_municipio.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Teléfono (opcional)
                </label>
                <input
                  {...register('phone', {
                     maxLength: { value: 20, message: 'No puede exceder los 20 caracteres' }
                  })}
                  id="phone"
                  type="tel"
                  className="mt-1 h-8 block w-full rounded-md border-gray-300 shadow-sm
                             focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                 {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4 p-6 md:border-l md:border-gray-200">
              <div>
                <label
                  htmlFor="optional_email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Correo electrónico (opcional)
                </label>
                <input
                  {...register('optional_email', {
                    pattern: {
                      value:
                        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Formato de correo inválido',
                    },
                     maxLength: { value: 100, message: 'No puede exceder los 100 caracteres' }
                  })}
                  id="optional_email"
                  type="email"
                  className="mt-1 h-8 block w-full rounded-md border-gray-300 shadow-sm
                            focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.optional_email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.optional_email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="registration_date"
                  className="block text-sm font-medium text-gray-700"
                >
                  Fecha de registro <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('registration_date', {
                    required: 'Este campo es obligatorio',
                  })}
                  type="date"
                  id="registration_date"
                  className="mt-1 h-8 block w-full rounded-md border-gray-300 shadow-sm
                        focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.registration_date && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.registration_date.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
                  Estado <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('status', {
                    required: 'Debe seleccionar un estado',
                  })}
                  id="status"
                  className="mt-1 h-8 block w-full rounded-md border-gray-300 shadow-sm
                             focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="ACTIVE">Activo</option>
                  <option value="INACTIVE">Inactivo</option>
                </select>
                {errors.status && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.status.message}
                  </p>
                )}
              </div>

              <div className="flex items-center pt-1">
                <Controller
                  name="has_establishments"
                  control={control}
                  render={({ field }) => (
                    <input
                      id="has_establishments"
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                  )}
                />
                <label
                  htmlFor="has_establishments"
                  className="ml-2 block text-sm text-gray-700"
                >
                  ¿Posee establecimientos?
                </label>
              </div>
            </div>
          </div>
        </div>


        

        {formError && (
          <p className="text-red-500 text-sm mt-4 text-center px-6 pb-4">{formError}</p>
        )}

        <div className="fixed inset-x-4 md:inset-x-8 bottom-4 z-50">
          <div className="bg-[#103A8C] rounded-2xl shadow-xl">
            <div
              className="rounded-2xl border border-[#1A3E9A] px-6 py-4
                flex flex-col md:flex-row items-center md:justify-between gap-y-4 md:gap-x-6"
            >
              {merchant && id && (
                <>
                  <div className="text-center md:text-left md:min-w-[260px]">
                    <p className="text-sm text-gray-200">
                      Total Ingresos Formulario:
                    </p>
                    <p className="text-2xl font-extrabold text-cyan-300 leading-tight">
                      ${totalIncome?.toLocaleString('es-CO') ?? '0'}
                    </p>
                  </div>
                  <div className="hidden md:block h-12 border-l border-[#1A3E9A]" />
                  <div className="text-center md:text-left md:min-w-[220px]">
                    <p className="text-sm text-gray-200">Cantidad de empleados:</p>
                    <p className="text-2xl font-extrabold text-cyan-300 leading-tight">
                      {totalEmployees?.toLocaleString('es-CO') ?? '0'}
                    </p>
                  </div>
                  <div className="hidden md:block h-12 border-l border-[#1A3E9A]" />
                </>
              )}

              <div className={`flex flex-col justify-between md:flex-row items-center gap-3 md:gap-4 w-full ${!(merchant && id) ? 'md:justify-end' : ''}`}> 
                <p className="text-sm text-gray-200 text-center md:text-left">
                  {merchant && id
                    ? 'Si ya actualizaste los datos, envía tu formulario aquí'
                    : 'Si ya ingresaste todos los datos, crea tu formulario aquí'}
                </p>
                <button
                  type="submit" 
                  disabled={isLoading}
                  className="bg-fuchsia-600 hover:bg-fuchsia-700 active:bg-fuchsia-800
                             text-white font-semibold text-sm px-5 py-2.5 rounded-md transition-colors
                             disabled:bg-gray-500 disabled:cursor-not-allowed w-full md:w-auto"
                >
                  {isLoading
                    ? 'Procesando...'
                    : merchant && id
                      ? 'Actualizar Formulario'
                      : 'Crear Formulario'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MerchantForm;
export interface Establishment {
  id_establishment: number;
  income: number;
  employee_count: number;
  name:string
}

export interface Merchant {
  id_merchant: number;
  business_name: string;
  id_municipio: number;
  municipality?: { 
    id_municipio: number;
    nombre: string;
  };
  phone?: string | null;
  optional_email?: string | null;
  registration_date: string; 
  status: 'ACTIVE' | 'INACTIVE';
  updated_at?: string;
  updated_by?: string;
  total_establishments?: number; 
  total_income?: number;
  total_employees?: number;
  establishment_count?: number; 
  establishment?: Establishment[];
}

export interface Municipality {
  id_municipio: number;
  nombre: string;
  id_department: number;
}

export interface PaginatedMerchantsResponse {
  items: Merchant[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface CreateMerchantDto {
  business_name: string;
  id_municipio: number;
  phone?: string;
  optional_email?: string;
  registration_date: string; 
  status: 'ACTIVE' | 'INACTIVE';
}

export interface UpdateMerchantDto {
  business_name?: string;
  id_municipio?: number;
  phone?: string;
  optional_email?: string;
  registration_date?: string; 
  status?: 'ACTIVE' | 'INACTIVE';
}
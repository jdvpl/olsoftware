-- =============================================
-- Script 03: Datos semilla para prueba OLSoftware
-- =============================================

-- Establecer usuario activo para auditoría
SELECT set_config('olsoftware.current_user', 'admin@example.com', false);

-- Insertar roles
INSERT INTO role (id_role, name) VALUES
  (1, 'ADMIN'),
  (2, 'AUX_REG');

-- Insertar país
INSERT INTO country (id_country, nombre) VALUES (1, 'Colombia');

-- Insertar departamentos
INSERT INTO department (id_department, nombre, id_country) VALUES
  (1, 'Cundinamarca', 1),
  (2, 'Antioquia', 1),
  (3, 'Valle del Cauca', 1),
  (4, 'Atlántico', 1),
  (5, 'Bolívar', 1);

-- Insertar municipios
INSERT INTO municipality (id_municipio, nombre, id_department) VALUES
  (1, 'Bogotá', 1),
  (2, 'Medellín', 2),
  (3, 'Cali', 3),
  (4, 'Barranquilla', 4),
  (5, 'Cartagena', 5);

-- Insertar usuarios con contraseñas bcrypt
-- admin@example.com       → admin123
-- bob@example.com         → registrador123
INSERT INTO "user" (name, email, password, role_id) VALUES
  ('Alice Admin', 'admin@example.com', '$2b$10$4D9Bb6asWpoq40qPhJQTDen0NS58tNUzWNhU08rLH7QSh2/D9bAnq', 1),
  ('Bob Registrar', 'bob@example.com', '$2b$10$QOb8PyqT1Xvvn7V8H6lgxO9R16hTpyNjya4owbKNugMoqNE.3QHkG', 2);

-- Insertar comerciantes
INSERT INTO merchant (business_name, id_municipio, phone, optional_email, registration_date, status) VALUES
  ('Global Tech', 1, '3101234567', 'contact@globaltech.com', '2024-06-01', 'ACTIVE'),
  ('Farmacia Central', 2, '3124567890', 'ventas@farmcentral.com', '2024-06-03', 'ACTIVE'),
  ('Panadería Sol', 3, '3117891234', NULL, '2024-05-15', 'INACTIVE'),
  ('Distribuciones Luna', 4, NULL, 'luna@distribuciones.com', '2024-04-10', 'ACTIVE'),
  ('Ferretería Norte', 5, '3158889999', 'info@ferrenorte.com', '2024-03-20', 'ACTIVE');

-- Insertar establecimientos
INSERT INTO establishment (name, income, employee_count, id_merchant) VALUES
  ('Global Store Bogotá', 12000.00, 8, 1),
  ('Global Express Medellín', 9000.00, 5, 1),
  ('Farmacia Central Norte', 15000.00, 10, 2),
  ('Farmacia Central Sur', 11000.00, 6, 2),
  ('Panadería Sol Centro', 8000.00, 3, 3),
  ('Panadería Sol Este', 6000.00, 2, 3),
  ('Distribuciones Luna Bodega', 10000.00, 4, 4),
  ('Distribuciones Luna Oficina', 9500.00, 3, 4),
  ('Ferretería Norte Principal', 18000.00, 9, 5),
  ('Ferretería Norte Sucursal', 16000.00, 7, 5);
-- ================================================
-- Script 01: Modelo de datos - Creación de tablas
-- ================================================

-- Crear tabla de roles
CREATE TABLE role (
    id_role SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Crear tabla de usuarios
CREATE TABLE "user" (
    id_user SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id INTEGER NOT NULL,
    CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES role(id_role)
);

-- Crear tabla de comerciantes
CREATE TABLE merchant (
    id_merchant SERIAL PRIMARY KEY,
    business_name TEXT NOT NULL,
    municipality VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    optional_email VARCHAR(255),
    registration_date DATE NOT NULL,
    status VARCHAR(10) CHECK (status IN ('ACTIVE', 'INACTIVE')) NOT NULL,
    updated_at TIMESTAMP,
    updated_by VARCHAR(100)
);

-- Crear tabla de establecimientos
CREATE TABLE establishment (
    id_establishment SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    income NUMERIC(12,2) NOT NULL,
    employee_count INTEGER NOT NULL,
    id_merchant INTEGER NOT NULL,
    updated_at TIMESTAMP,
    updated_by VARCHAR(100),
    CONSTRAINT fk_establishment_merchant FOREIGN KEY (id_merchant)
        REFERENCES merchant(id_merchant) ON DELETE CASCADE
);

-- Índices para mejorar rendimiento en consultas
CREATE INDEX idx_user_email ON "user"(email);
CREATE INDEX idx_merchant_status ON merchant(status);
CREATE INDEX idx_merchant_name ON merchant(business_name);
CREATE INDEX idx_establishment_merchant ON establishment(id_merchant);

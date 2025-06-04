-- ====================================================
-- Script 02: Funciones y triggers para campos de auditoría
-- ====================================================

-- Antes de insertar o actualizar, establecer campos:
-- updated_at: con fecha actual
-- updated_by: desde variable de sesión olsoftware.current_user

-- Función para la tabla merchant
CREATE OR REPLACE FUNCTION trg_set_merchant_audit()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := CURRENT_TIMESTAMP;
    NEW.updated_by := current_setting('olsoftware.current_user', true);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para la tabla establishment
CREATE OR REPLACE FUNCTION trg_set_establishment_audit()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := CURRENT_TIMESTAMP;
    NEW.updated_by := current_setting('olsoftware.current_user', true);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear triggers para ejecutar funciones en INSERT o UPDATE
CREATE TRIGGER trg_merchant_audit
BEFORE INSERT OR UPDATE ON merchant
FOR EACH ROW
EXECUTE FUNCTION trg_set_merchant_audit();

CREATE TRIGGER trg_establishment_audit
BEFORE INSERT OR UPDATE ON establishment
FOR EACH ROW
EXECUTE FUNCTION trg_set_establishment_audit();

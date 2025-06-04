#  Base de Datos - Reto Técnico OLSoftware

Este módulo contiene los scripts SQL necesarios para levantar el modelo de datos, activar triggers de auditoría y cargar datos de prueba para la evaluación técnica.

---

##  Archivos

| Archivo                       | Descripción                                           |
|------------------------------|-------------------------------------------------------|
| `01_data_model.sql`        | Crea todas las tablas (`role`, `user`, `merchant`, `establishment`) con índices |
| `02_sequences_triggers_audit.sql` | Define funciones y triggers para los campos `updated_at` y `updated_by` |
| `03_seed_data.sql`       | Inserta datos de prueba: roles, usuarios, comerciantes y establecimientos |

---

##  Contraseñas de Usuarios (bcrypt)

| Usuario             | Rol        | Contraseña         |
|---------------------|------------|---------------------|
| admin@example.com   | ADMIN      | `admin123`          |
| bob@example.com     | AUX_REG    | `registrador123`    |

---

##  Instrucciones de uso

1. Asegúrate de tener una base de datos PostgreSQL activa (versión 17+ recomendada).
2. Ejecuta los scripts en orden



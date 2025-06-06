# Descripción de la Prueba Técnica FullStack - OLSoftware

## Introducción

El presente documento describe la solución implementada para la Prueba Técnica FullStack propuesta por OLSoftware. El objetivo del reto fue desarrollar una aplicación web completa para la gestión de comerciantes y sus establecimientos, abarcando desde el diseño de la base de datos hasta la implementación del backend y frontend.

La problemática central aborda la necesidad del gremio de comercio de disponer de una herramienta centralizada para analizar información del mercado y tomar decisiones estratégicas.

## Tecnologías Utilizadas

**Backend:**
* **Framework:** NestJS 10+
* **Lenguaje:** TypeScript
* **Base de Datos:** PostgreSQL 17+ (específicamente `postgres:17.5` vía Docker)
* **ORM:** Prisma
* **Autenticación:** JWT (JSON Web Tokens)
* **Validación:** class-validator, class-transformer, Joi
* **Documentación API:** Swagger (OpenAPI)
* **Testing:** Jest

**Frontend:**
* **Framework:** Next.js 15+ (específicamente 15.3.3)
* **Lenguaje:** TypeScript
* **UI:** React 19, TailwindCSS
* **Gestión de Estado (Autenticación):** React Context API (`AuthContext`)
* **Peticiones HTTP:** Axios
* **Formularios:** React Hook Form
* **Iconos:** Heroicons

**Base de Datos (Scripts):**
* Se proporcionaron scripts SQL para la creación del modelo, auditoría y carga de datos semilla.

## Estructura del Proyecto

El proyecto se organiza en las siguientes carpetas principales:
* `database/`: Contiene los scripts SQL para la base de datos.
* `backend/`: Aplicación NestJS (API).
* `frontend/`: Aplicación Next.js (Interfaz de Usuario).

## Base de Datos (Retos 1-3)

### Reto 1: Modelo de Datos
Se construyó un modelo de datos relacional en PostgreSQL para almacenar la información requerida:
* **`role`**: Almacena los roles de usuario (Administrador, Auxiliar de Registro).
* **`country`**, **`department`**, **`municipality`**: Tablas normalizadas para la gestión de ubicaciones geográficas.
* **`user`**: Contiene Nombre, Correo Electrónico, Contraseña (hasheada con bcrypt) y Rol.
* **`merchant`**: Almacena Nombre o razón social, Municipio, Teléfono (opcional), Correo Electrónico (opcional), Fecha de Registro y Estado (Activo/Inactivo). Incluye campos de auditoría (`updated_at`, `updated_by`).
* **`establishment`**: Contiene Nombre del Establecimiento, Ingresos (numérico con dos decimales), Número de Empleados y el Comerciante asociado. Incluye campos de auditoría.
Se definieron los índices necesarios para optimizar las consultas.

### Reto 2: Secuencias, Identificadores y Auditoría
* Los identificadores únicos de cada tabla son generados por secuencias (`SERIAL`).
* Los campos de auditoría (`updated_at`, `updated_by`) se actualizan automáticamente en las tablas `merchant` y `establishment` mediante triggers de base de datos. El campo `updated_by` se popula con el valor de la variable de sesión `olsoftware.current_user`, que es establecida por la aplicación backend antes de las operaciones de escritura.

### Reto 3: Datos Semilla
Se generaron datos semilla para todas las entidades:
* 2 Usuarios (uno por cada rol: ADMIN y AUX_REG).
* 5 Comerciantes.
* 10 Establecimientos (2 por cada comerciante).
Los scripts SQL (`01_data_model.sql`, `02_sequences_triggers_audit.sql`, `03_seed_data.sql`) están numerados para su correcta ejecución.

## Backend API (NestJS - Retos 4-7)

### Reto 4: Web API - Seguridad
* **Endpoint de Login:** Se creó `/auth/login` que recibe correo y contraseña. Es un endpoint público.
* **JWT:** Al autenticarse, se genera un JWT con 1 hora de expiración.
* **Autorización por Roles:** Se implementó control de acceso (Administrador, Auxiliar de Registro) para los endpoints utilizando guards y decoradores.
* **ORM:** Se utilizó Prisma ORM para la interacción con la base de datos.
* **CORS:** Se configuró una política de CORS para permitir el consumo controlado de la API.

### Reto 5: Web API - Listas de Valores
* Se creó un endpoint (`GET /valores/municipios`) para retornar la lista de municipios.
* El endpoint es privado y requiere autenticación JWT.
* Las respuestas HTTP están estandarizadas.

### Reto 6: Web API - CRUD Comerciante
Se implementaron los siguientes endpoints para la entidad `Comerciante`:
* **Consulta Paginada (`GET /comerciantes`):** Por defecto 5 registros por página, con filtros por nombre/razón social, fecha de registro y estado.
* **Consultar por ID (`GET /comerciantes/:id`):** Obtiene un comerciante específico.
* **Crear (`POST /comerciantes`):** Registra un nuevo comerciante.
* **Actualizar (`PUT /comerciantes/:id`):** Modifica un comerciante existente.
* **Eliminar (`DELETE /comerciantes/:id`):** Solo para rol Administrador.
* **Modificar Estado (`PATCH /comerciantes/:id/estado`):** Cambia el estado (Activo/Inactivo) de un comerciante.
Se implementaron validaciones de datos en los DTOs (`CreateMerchantDto`, `UpdateMerchantDto`) y se utiliza un `ValidationPipe` global. Todos los endpoints son privados y requieren JWT.

### Reto 7: Web API - Reporte Comerciantes
* Se creó un endpoint (`GET /comerciantes/reporte/csv`) que genera un archivo CSV con información de comerciantes activos.
* El archivo incluye: Nombre o razón social, Municipio, Teléfono, Correo Electrónico, Fecha de Registro, Estado, Cantidad de Establecimientos, Total Ingresos y Cantidad de Empleados.
* Los campos calculados se basan en los establecimientos asociados. El separador es el carácter pipe (`|`).
* Este endpoint es privado y accesible solo por el rol Administrador.

### Características Adicionales del Backend
* **Documentación API:** Integración con Swagger para la documentación y prueba de endpoints.
* **Pruebas Unitarias:** Se crearon pruebas unitarias para los casos de uso de autenticación y comerciantes utilizando Jest.

## Frontend (Next.js - Retos 8-10)

### Reto 8: Página - Login
* Se desarrolló una interfaz de usuario para la autenticación con campos para correo electrónico, contraseña y un checkbox para aceptar términos y condiciones.
* Una vez autenticado, el encabezado de la aplicación muestra el nombre del usuario y su rol.
* La autenticación se realiza consumiendo el endpoint del Reto 4, utilizando JWT.
* El diseño respeta el prototipo suministrado.

### Reto 9: Página - Home (Lista de Comerciantes)
* Se implementó una página principal que muestra una tabla con los comerciantes registrados.
* **Columnas de la Tabla:** Nombre o Razón Social, Teléfono, Correo Electrónico, Fecha Registro, No. Establecimientos, Estado y Acciones.
* **Paginación:** La tabla cuenta con paginación y permite seleccionar 5, 10 o 15 ítems por página.
* **Acciones:**
    * Editar Registro: Redirige al formulario de edición.
    * Activar/Inactivar Registro: Consume el endpoint del Reto 6.
    * Eliminar Registro: Visible y ejecutable solo por el rol Administrador.
* **Botones Adicionales:**
    * Descargar Reporte en CSV: Consume el endpoint del Reto 7 (solo para Administradores).
    * Crear Nuevo Comerciante: Redirige al formulario de creación.
* **Cerrar Sesión:** Funcionalidad implementada.
* El diseño se alinea con el prototipo proporcionado.

### Reto 10: Página - Formulario (Creación y Actualización)
* Se desarrolló un formulario para crear y actualizar comerciantes con los campos: Nombre o Razón Social, Municipio (selector), Teléfono, Correo Electrónico, Fecha de Registro (selector de fecha), Estado (selector) y un checkbox para "¿Posee establecimientos?".
* **Footer en Edición:** Al editar un comerciante, se muestra un pie de formulario con la sumatoria de ingresos y cantidad de empleados de los establecimientos asociados (basado en datos semilla del Reto 3). *Nota: La visualización de estos datos depende de que el endpoint `GET /comerciantes/:id` del backend los provea.*
* Se consumen los endpoints de los Retos 5 (municipios) y 6 (CRUD comerciante).
* Todos los campos del formulario cuentan con validaciones de tipo de dato, obligatoriedad y formato, con feedback al usuario.
* El diseño sigue el prototipo.

### Características Adicionales del Frontend
* **Gestión de Estado Global:** Se utilizó React Context API para la gestión del estado de autenticación.



## Conclusión

La solución desarrollada cumple con la mayoría de los requisitos establecidos en la prueba técnica, entregando una aplicación funcional con un backend robusto y una interfaz de usuario intuitiva para la gestión de comerciantes. Se han aplicado buenas prácticas en el desarrollo y se ha prestado atención a los detalles de seguridad y usabilidad descritos.
# Sistema de Turnos Médicos

Aplicación segura y modular para la gestión de turnos médicos utilizando Node.js, Express y MongoDB.

## Arquitectura

Clean Architecture por capas:

```
src/
├── config/        # Configuración (DB, env)
├── controllers/   # Manejo de request/response
├── middleware/     # Auth JWT, roles, validación, errores
├── models/        # Schemas de Mongoose
├── routes/        # Definición de rutas Express
├── services/      # Lógica de negocio
├── validators/    # Schemas de validación (Joi)
└── app.js         # Entry point
tests/             # Tests con Jest + Supertest
```

## Requisitos

- Node.js 18+
- MongoDB (o usar tests con mongodb-memory-server)

## Instalación

```bash
git clone <repo-url>
cd turnos-medicos
npm install
cp .env.example .env   # Editar con valores reales
```

## Uso

```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## Endpoints

### Auth (públicos)

| Método | Ruta                | Descripción                     |
|--------|---------------------|----------------------------------|
| POST   | `/api/auth/register` | Registrar nuevo usuario         |
| POST   | `/api/auth/login`    | Login, devuelve JWT             |
| GET    | `/api/auth/me`       | Perfil del usuario autenticado  |

### Turnos (autenticado)

| Método | Ruta                       | Acceso  | Descripción                  |
|--------|----------------------------|---------|------------------------------|
| POST   | `/api/turnos`              | cliente | Crear un turno               |
| GET    | `/api/turnos/mis-turnos`   | cliente | Historial del paciente       |
| GET    | `/api/turnos`              | admin   | Listar todos (con filtros)   |
| GET    | `/api/turnos/:id`          | ambos   | Obtener turno por ID         |
| PUT    | `/api/turnos/:id`          | admin   | Actualizar turno             |
| PATCH  | `/api/turnos/:id/estado`   | admin   | Cambiar estado               |

### Usuarios (solo admin)

| Método | Ruta                | Descripción               |
|--------|---------------------|---------------------------|
| GET    | `/api/usuarios`     | Listar usuarios activos   |
| GET    | `/api/usuarios/:id` | Obtener usuario por ID    |
| PUT    | `/api/usuarios/:id` | Actualizar usuario        |
| DELETE | `/api/usuarios/:id` | Desactivar usuario        |

### Filtros para GET /api/turnos

- `?especialidad=Cardiología`
- `?profesional=<id>`
- `?estado=pendiente`
- `?fecha=2026-06-15`

## Seguridad

- Contraseñas hasheadas con bcrypt (salt rounds = 10)
- Autenticación mediante JWT (expiración 24h)
- Middleware de autorización por roles (admin, cliente)
- Validación de datos con Joi
- Middleware global de manejo de errores

## Tests

```bash
npm test
```

Usa `mongodb-memory-server` para base de datos en memoria, sin necesidad de MongoDB instalado.

## Roles

- **admin**: Gestión completa de turnos y usuarios
- **cliente**: Creación de turnos y visualización de su historial
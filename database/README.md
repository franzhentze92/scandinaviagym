# Base de Datos - Scandinavia Gym

## Configuración de Supabase

### 1. Crear un proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Anota la URL del proyecto y la clave anónima (anon key)

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
```

### 3. Ejecutar el esquema SQL

1. Ve al SQL Editor en tu proyecto de Supabase
2. Copia y pega el contenido de `database/schema.sql`
3. Ejecuta el script para crear todas las tablas, índices y políticas RLS
4. **IMPORTANTE**: Ejecuta también el contenido de `database/triggers.sql` para crear el trigger que automáticamente crea el perfil cuando un usuario se registra
5. **IMPORTANTE**: Ejecuta el contenido de `database/storage-setup.sql` para crear el bucket de storage para avatares y sus políticas de acceso
6. **OPCIONAL**: Ejecuta el contenido de `database/seed-data.sql` para poblar las tablas con datos de ejemplo (sedes, categorías, instructores, clases y horarios)

### 3.1. Migraciones

Si ya tienes una base de datos existente y necesitas agregar nuevas columnas o modificar el esquema:

- **`database/add-gym-code-column.sql`**: Agrega la columna `gym_code` a la tabla `user_profiles` para almacenar el código proporcionado por el gimnasio al inscribirse
- **`database/add-role-column.sql`**: Agrega la columna `role` a la tabla `user_profiles` para diferenciar entre usuarios cliente y administradores

### 3.2. Crear un Usuario Administrador

Para crear un usuario administrador después de ejecutar las migraciones:

1. Crea un usuario normal a través del registro en la aplicación
2. Ve al SQL Editor en Supabase y ejecuta:

```sql
-- Reemplaza 'email-del-usuario@ejemplo.com' con el email del usuario que quieres hacer admin
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'email-del-usuario@ejemplo.com';
```

O si conoces el ID del usuario:

```sql
-- Reemplaza 'user-id-aqui' con el UUID del usuario
UPDATE user_profiles 
SET role = 'admin' 
WHERE id = 'user-id-aqui';
```

**Nota**: Por defecto, todos los usuarios nuevos tienen el rol `'client'`. Solo los usuarios con `role = 'admin'` pueden acceder a las rutas `/admin/*`.

### 4. Estructura de la Base de Datos

La base de datos incluye las siguientes tablas principales:

- **user_profiles**: Perfiles de usuarios
- **sedes**: Ubicaciones del gimnasio
- **membership_plans**: Planes de membresía
- **user_memberships**: Membresías de usuarios
- **class_categories**: Categorías de clases
- **classes**: Clases disponibles
- **class_schedules**: Horarios de clases
- **class_reservations**: Reservas de clases
- **instructors**: Instructores
- **user_progress**: Progreso de usuarios
- **workout_history**: Historial de entrenamientos
- **achievements**: Logros disponibles
- **user_achievements**: Logros de usuarios
- **challenges**: Retos disponibles
- **user_challenges**: Participación en retos
- **support_tickets**: Tickets de soporte
- **faq_items**: Preguntas frecuentes
- **user_sessions**: Sesiones activas de usuarios

### 5. Uso en la aplicación

Los servicios de base de datos están disponibles en `src/services/database.ts`. Puedes importarlos y usarlos así:

```typescript
import { getUserProfile, updateUserProfile } from '@/services/database';

// Obtener perfil de usuario
const profile = await getUserProfile(userId);

// Actualizar perfil
const updated = await updateUserProfile(userId, {
  full_name: 'Nuevo Nombre',
  phone: '+502 1234-5678'
});
```

### 6. Seguridad (RLS)

Todas las tablas tienen Row Level Security (RLS) habilitado. Las políticas garantizan que:

- Los usuarios solo pueden ver y modificar sus propios datos
- Los datos públicos (sedes, clases, instructores) son visibles para todos
- Los datos privados requieren autenticación

### 7. Datos de ejemplo

Puedes insertar datos de ejemplo ejecutando scripts SQL adicionales o usando la interfaz de Supabase para agregar datos manualmente.


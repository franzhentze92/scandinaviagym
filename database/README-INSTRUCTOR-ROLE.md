# Creación de Rol de Instructor y Usuarios

Este documento explica cómo agregar el rol "instructor" y crear usuarios para todos los instructores.

## Paso 1: Agregar el Rol "instructor"

Ejecuta el siguiente script SQL en Supabase:

```sql
-- Archivo: database/add-instructor-role.sql
```

Este script:
- Elimina la restricción CHECK existente en la columna `role`
- Agrega una nueva restricción que incluye 'instructor' como opción válida
- Actualiza el comentario de la columna

## Paso 2: Crear Usuarios para Instructores

Tienes dos opciones para crear usuarios:

### Opción A: Usando Script Node.js (Recomendado)

1. Instala las dependencias:
```bash
npm install @supabase/supabase-js
```

2. Edita `database/create-instructor-users-api.js` y configura:
   - `SUPABASE_URL`: Tu URL de Supabase
   - `SUPABASE_SERVICE_ROLE_KEY`: Tu Service Role Key (Admin API key)

3. Ejecuta el script:
```bash
node database/create-instructor-users-api.js
```

Este script:
- Obtiene todos los instructores de la base de datos
- Crea usuarios en `auth.users` para cada instructor
- Crea perfiles en `user_profiles` con rol "instructor"
- Asigna una contraseña temporal: `TempPassword123!`

### Opción B: Manualmente desde Supabase Dashboard

1. Ejecuta el script SQL `database/create-instructor-users.sql` para ver qué instructores necesitan usuarios

2. Para cada instructor:
   - Ve a Authentication > Users en Supabase Dashboard
   - Crea un nuevo usuario con el email del instructor
   - Copia el User ID generado
   - Ejecuta la función `create_instructor_profile()` con los datos del instructor

## Paso 3: Verificar

Después de crear los usuarios, verifica que todo esté correcto:

```sql
-- Ver todos los usuarios con rol instructor
SELECT 
  up.id,
  up.email,
  up.full_name,
  up.role,
  i.name as instructor_name,
  i.specialty
FROM user_profiles up
LEFT JOIN instructors i ON i.email = up.email
WHERE up.role = 'instructor';
```

## Notas Importantes

- **Contraseña temporal**: Todos los usuarios creados tendrán la contraseña `TempPassword123!`
- **Cambio de contraseña**: Los instructores deben cambiar su contraseña en el primer inicio de sesión
- **Emails duplicados**: El script verifica que no existan usuarios con el mismo email antes de crear
- **Service Role Key**: Solo usa la Service Role Key en scripts seguros, nunca en el frontend

## Actualización del Código

El código TypeScript ya ha sido actualizado para:
- Incluir 'instructor' como tipo válido en `UserProfile`
- Agregar `isInstructor` al `AuthContext`
- Soportar el nuevo rol en toda la aplicación


# Análisis de Datos Reales - scandinavia_seed_from_photos.sql

## Resumen Ejecutivo

Este documento analiza el archivo `scandinavia_seed_from_photos.sql` que contiene información real extraída de las fotos de horarios de clases del gimnasio Scandinavia Gym.

## Comparación: Datos Reales vs. Datos de Ejemplo

### 1. Categorías de Clases

**Datos Reales (16 categorías):**
- Aeróbicos
- Baile
- Baile Latino
- Baile/Step
- Body Step
- Dance
- Fitness de Combate
- Funcional
- Pilates
- Salsa
- Spinning
- Step
- Strong
- Tae-bo
- Yoga
- Zumba

**Datos de Ejemplo (7 categorías):**
- Spinning
- Pilates
- Funcional
- Baile
- Tae-bo
- Zumba
- Box

**Diferencia:** Los datos reales incluyen 9 categorías adicionales y no incluyen "Box".

### 2. Instructores

**Datos Reales:** 45 instructores con nombres reales
- Alba, Alejandra, Alex Morales, Andrea Cayax, Bayron Posadas, Boby, Brenda G, Brenda Galicia, Byron, Byron Posadas, Darvy, Dilan, Eddy, Eleana Barrientos, Elias, Erick Mazariegos, Gustavo, Hamilton, Hector, Horacio González, Jonathan, Jorge, José, Karla Perez, Manuel, Manuel Altan, Marco, Moises Santa Cruz, Morales, Noe Amaya, Otto Solorzano, Pablo, Rafael, Rashel, Raxchel, Raxchel Oliva, Raxhel Oliva, Rosmery, Sabrina, Selvin, Sergio Nufio, Sergio Santa Cruz, Tarsis

**Datos de Ejemplo:** 8 instructores genéricos
- María González, Carlos Ruiz, Ana Martínez, Luis Herrera, Sofia López, Elena Vega, Roberto Díaz, Miguel Torres

**Diferencia:** Los datos reales tienen 37 instructores adicionales con nombres reales del gimnasio.

### 3. Clases

**Datos Reales:** 85 clases generadas
- Cada clase está asociada a: categoría + instructor + sede
- Formato: `{Categoría} - {Instructor}` (ej: "Funcional - Manuel Altan")
- Todas tienen duración de 60 minutos, capacidad de 20, intensidad "Media", nivel "Todos los niveles"

**Datos de Ejemplo:** Clases genéricas de ejemplo

**Diferencia:** Los datos reales reflejan las clases reales que se imparten en cada sede.

### 4. Horarios de Clases (class_schedules)

**Datos Reales:** 173 horarios reales
- Extraídos directamente de las fotos de los horarios
- Incluyen días de la semana (0=Domingo, 1=Lunes, ..., 6=Sábado)
- Horarios desde las 05:00 hasta las 20:40
- Distribuidos entre las 8 sedes

**Datos de Ejemplo:** Horarios genéricos de ejemplo

**Diferencia:** Los datos reales reflejan los horarios exactos que se muestran en las fotos.

### 5. Sedes

**Compatibilidad:** ✅ Los IDs de sedes son idénticos en ambos archivos:
- `00000000-0000-0000-0000-000000000001` - Zona 1
- `00000000-0000-0000-0000-000000000002` - Zona 2
- `00000000-0000-0000-0000-000000000003` - Zona 6
- `00000000-0000-0000-0000-000000000004` - Zona 12
- `00000000-0000-0000-0000-000000000005` - Carr. a El Salvador
- `00000000-0000-0000-0000-000000000006` - Quetzaltenango
- `00000000-0000-0000-0000-000000000007` - San José Pinula
- `00000000-0000-0000-0000-000000000008` - Villa Nueva Punto Vivo

## Estructura de Datos

### Mapeo de Sedes en Datos Reales

El archivo real usa los mismos IDs de sedes que el seed actual, lo que facilita la migración:

1. **Zona 1** (`00000000-0000-0000-0000-000000000001`)
   - 20 clases
   - Instructores: Gustavo, Jonathan, Jorge, Rafael, Rashel, Raxchel, Rosmery, Sabrina

2. **Zona 2** (`00000000-0000-0000-0000-000000000002`)
   - 15 clases
   - Instructores: Alex Morales, Erick Mazariegos, Karla Perez, Moises Santa Cruz, Morales, Noe Amaya, Otto Solorzano, Sabrina, Sergio Nufio

3. **Zona 6** (`00000000-0000-0000-0000-000000000003`)
   - 8 clases
   - Instructores: Byron Posadas, Dilan, Hamilton

4. **Zona 12** (`00000000-0000-0000-0000-000000000004`)
   - 20 clases
   - Instructores: Darvy, Hector, Marco, Moises Santa Cruz, Sergio Santa Cruz, Tarsis

5. **Carr. a El Salvador** (`00000000-0000-0000-0000-000000000005`)
   - 12 clases
   - Instructores: Andrea Cayax, Bayron Posadas, Horacio González, Manuel Altan, Raxchel Oliva

6. **Quetzaltenango** (`00000000-0000-0000-0000-000000000006`)
   - 0 clases (no aparece en los datos reales)

7. **San José Pinula** (`00000000-0000-0000-0000-000000000007`)
   - 9 clases
   - Instructores: Brenda Galicia, Byron, José, Manuel, Raxhel Oliva

8. **Villa Nueva Punto Vivo** (`00000000-0000-0000-0000-000000000008`)
   - 12 clases
   - Instructores: Alba, Alejandra, Boby, Eddy, Elias, Pablo, Selvin

## Plan de Migración

### Opción 1: Reemplazo Completo (Recomendado)
1. Limpiar datos de ejemplo de: `class_categories`, `instructors`, `classes`, `class_schedules`
2. Insertar datos reales del archivo `scandinavia_seed_from_photos.sql`
3. Mantener las sedes existentes (ya son correctas)

### Opción 2: Migración Incremental
1. Agregar nuevas categorías que no existen
2. Agregar nuevos instructores
3. Agregar nuevas clases
4. Agregar nuevos horarios
5. Mantener datos de ejemplo si no hay conflicto

### Recomendación

**Usar Opción 1 (Reemplazo Completo)** porque:
- Los datos reales son más completos y precisos
- Evita duplicados y confusiones
- Los datos de ejemplo no son necesarios para producción
- Los IDs de sedes ya coinciden

## Notas Importantes

1. **IDs UUID:** El archivo real usa UUIDs generados, no los IDs secuenciales del seed actual
2. **Colores:** Todas las categorías usan el mismo color `#84cc16` (verde lima)
3. **Iconos:** Todas las categorías usan el icono `'Activity'`
4. **Duración:** Todas las clases tienen 60 minutos de duración
5. **Capacidad:** Todas las clases tienen capacidad de 20 personas
6. **Intensidad:** Todas las clases tienen intensidad "Media"
7. **Nivel:** Todas las clases son para "Todos los niveles"

## Próximos Pasos

1. ✅ Crear script de migración que combine sedes del seed actual con datos reales
2. ✅ Verificar que no haya conflictos de IDs
3. ✅ Probar el script en un entorno de desarrollo
4. ✅ Ejecutar en producción después de validación


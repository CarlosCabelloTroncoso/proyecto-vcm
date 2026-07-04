# Scripts SQL de la base de datos (Supabase)

Estos archivos permiten recrear la base de datos completa en un proyecto de Supabase
nuevo. Ejecútalos en el **SQL Editor** de Supabase **en este orden**:

| Orden | Archivo | Contenido |
|---|---|---|
| 1º | `schema.sql` | Esquema: tablas, funciones, constraints, grants |
| 2º | `inserts.sql` | Datos iniciales (sentencias `INSERT`) |
| 3º | `policies.sql` | Seguridad RLS: `ENABLE ROW LEVEL SECURITY` + `CREATE POLICY` |

> El orden importa: los datos necesitan que las tablas ya existan, y las policies
> necesitan que existan tablas y datos.

Los pasos detallados están en `manualInstalacion/INSTALACION.md` (sección 5).

## ¿Cómo se generaron?

Exportados desde el proyecto de Supabase con la CLI oficial:

```bash
npx supabase db dump --db-url "<CONNECTION_STRING_SESSION_POOLER>" -f schema.sql
npx supabase db dump --db-url "<CONNECTION_STRING_SESSION_POOLER>" --data-only -f inserts.sql
```

Las policies venían dentro de `schema.sql` y se separaron a `policies.sql`.

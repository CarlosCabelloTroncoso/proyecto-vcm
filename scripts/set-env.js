/**
 * Genera src/environments/environment.ts a partir de variables de entorno.
 *
 * - En Vercel (o cualquier CI): lee SUPABASE_URL y SUPABASE_KEY y crea el archivo.
 * - En local: si NO hay variables de entorno, NO toca el archivo existente
 *   (así tu environment.ts de desarrollo queda intacto).
 */
const fs = require('fs');
const path = require('path');

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_KEY;

const target = path.join(__dirname, '..', 'src', 'environments', 'environment.ts');

if (!url || !key) {
  if (fs.existsSync(target)) {
    console.log('[set-env] Sin variables de entorno: se conserva el environment.ts existente.');
    process.exit(0);
  }
  console.error('[set-env] ERROR: faltan SUPABASE_URL / SUPABASE_KEY y no existe environment.ts.');
  process.exit(1);
}

const content = `export const environment = {
  production: true,
  supabaseUrl: '${url}',
  supabaseKey: '${key}',
};
`;

fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, content);
console.log('[set-env] environment.ts generado desde variables de entorno.');

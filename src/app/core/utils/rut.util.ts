/** Limpia un RUT: quita puntos y guion, y lo pasa a mayúscula (para la K). */
export function limpiarRut(rut: string): string {
  return (rut ?? '').replace(/\./g, '').replace(/-/g, '').toUpperCase();
}

/**
 * Valida un RUT chileno con su dígito verificador (módulo 11).
 * Acepta el RUT con o sin puntos/guion. Devuelve true si es válido.
 */
export function validarRut(rut: string): boolean {
  const limpio = limpiarRut(rut);
  if (!/^[0-9]{7,8}[0-9K]$/.test(limpio)) return false;

  const cuerpo = limpio.slice(0, -1);
  const dv     = limpio.slice(-1);

  let suma = 0;
  let multiplo = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }

  const resto = 11 - (suma % 11);
  const dvEsperado = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto);
  return dv === dvEsperado;
}

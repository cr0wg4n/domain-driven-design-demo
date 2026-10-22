import { getCookie } from 'h3'
import type { H3Event } from 'h3'
import { COOKIE_DE_ZONA, esZonaValida } from '#compartido/shared/zona-horaria'

function leerZona(event: H3Event): string | null {
  const zona = getCookie(event, COOKIE_DE_ZONA)
  return esZonaValida(zona) ? zona : null
}

export { leerZona }

import { TZDate } from '@date-fns/tz'
import { addDays, format } from 'date-fns'
import { es } from 'date-fns/locale'

type Instante = Date | string

const COOKIE_DE_ZONA = 'nodo-zona-horaria'
const ZONA_POR_DEFECTO = 'UTC'

function esZonaValida(zona: string | null | undefined): zona is string {
  if (!zona) return false
  try {
    new Intl.DateTimeFormat('es', { timeZone: zona })
    return true
  } catch {
    return false
  }
}

function enZona(instante: Instante, zona: string): TZDate {
  return new TZDate(new Date(instante).getTime(), zona)
}

function mediodiaDe(clave: string, zona: string): TZDate {
  const [anio = 0, mes = 1, dia = 1] = clave.split('-').map(Number)
  return new TZDate(anio, mes - 1, dia, 12, 0, zona)
}

function claveDeDia(instante: Instante, zona: string): string {
  return format(enZona(instante, zona), 'yyyy-MM-dd')
}

function sumarDias(clave: string, dias: number, zona: string): string {
  return format(addDays(mediodiaDe(clave, zona), dias), 'yyyy-MM-dd')
}

function nombreDelDia(clave: string, zona: string): string {
  return format(mediodiaDe(clave, zona), "EEEE d 'de' MMMM", { locale: es })
}

function instanteEnDia(clave: string, horas: number, minutos: number, zona: string): string {
  const [anio = 0, mes = 1, dia = 1] = clave.split('-').map(Number)
  const local = new TZDate(anio, mes - 1, dia, horas, minutos, zona)
  return new Date(local.getTime()).toISOString()
}

function minutosDelDia(instante: Instante, zona: string): number {
  const local = enZona(instante, zona)
  return local.getHours() * 60 + local.getMinutes()
}

function hora(instante: Instante, zona: string): string {
  return format(enZona(instante, zona), 'HH:mm')
}

export { COOKIE_DE_ZONA, ZONA_POR_DEFECTO, esZonaValida, claveDeDia, sumarDias, nombreDelDia, instanteEnDia, minutosDelDia, hora }
export type { Instante }

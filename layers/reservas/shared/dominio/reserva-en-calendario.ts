import { Rol } from '#compartido/shared/rol'
import type { Sesion } from '#compartido/shared/sesion'
import type { DatosDeReserva } from './reserva'

interface ReservaEnCalendario extends Omit<DatosDeReserva, 'titular'> {
  readonly titular: string | null
  readonly esPropia: boolean
}

function puedeVerDetalle(sesion: Sesion, esPropia: boolean): boolean {
  return sesion.rol !== Rol.MIEMBRO || esPropia
}

function paraElCalendario(reserva: DatosDeReserva, sesion: Sesion): ReservaEnCalendario {
  const esPropia = reserva.titular === sesion.nombre
  return { ...reserva, titular: puedeVerDetalle(sesion, esPropia) ? reserva.titular : null, esPropia }
}

export { paraElCalendario }
export type { ReservaEnCalendario }

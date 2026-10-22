import type { ReservaEnCalendario } from '#reservas/shared/dominio/reserva-en-calendario'
import type { Franja, RecursoReservable } from '#reservas/shared/dominio/recurso-reservable'
import { consultar } from '#compartido/app/services/api.service'

const RUTA_DE_RESERVAS = '/api/reservas'
const RUTA_DE_RECURSOS = '/api/reservas/recursos'

interface PedidoDeReservaEnviado {
  recursoId: string
  titular: string
  franja: Franja
}

const rutaDeComando = {
  reservar: () => RUTA_DE_RESERVAS,
  cancelar: (id: string) => `${RUTA_DE_RESERVAS}/${id}/cancelar`,
  reasignar: (id: string) => `${RUTA_DE_RESERVAS}/${id}/reasignar`
}

async function listarReservas(): Promise<ReservaEnCalendario[]> {
  return await consultar<ReservaEnCalendario[]>(RUTA_DE_RESERVAS)
}

async function listarRecursos(): Promise<RecursoReservable[]> {
  return await consultar<RecursoReservable[]>(RUTA_DE_RECURSOS)
}

export { listarReservas, listarRecursos, rutaDeComando }
export type { PedidoDeReservaEnviado }

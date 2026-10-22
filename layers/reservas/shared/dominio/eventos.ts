enum EventoReservas {
  RESERVA_CONFIRMADA = 'ReservaConfirmada',
  RESERVA_CANCELADA = 'ReservaCancelada',
  RESERVA_POR_REASIGNAR = 'ReservaPorReasignar',
  RESERVA_REASIGNADA = 'ReservaReasignada'
}

interface ReservaConfirmada {
  readonly reservaId: string
  readonly titular: string
  readonly recurso: string
  readonly inicio: string
  readonly fin: string
}

interface ReservaCancelada {
  readonly reservaId: string
  readonly titular: string
  readonly recurso: string
}

interface ReservaPorReasignar {
  readonly reservaId: string
  readonly titular: string
  readonly recurso: string
  readonly motivo: string
}

interface ReservaReasignada {
  readonly reservaId: string
  readonly titular: string
  readonly recursoAnterior: string
  readonly recursoNuevo: string
}

export { EventoReservas }
export type { ReservaConfirmada, ReservaCancelada, ReservaPorReasignar, ReservaReasignada }

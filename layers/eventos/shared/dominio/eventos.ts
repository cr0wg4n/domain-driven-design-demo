enum EventoAgenda {
  EVENTO_SOLICITADO = 'EventoSolicitado',
  EVENTO_APROBADO = 'EventoAprobado'
}

interface EventoSolicitado {
  readonly solicitudId: string
  readonly organizador: string
  readonly asistentes: number
  readonly requiereAprobacion: boolean
}

interface EventoAprobado {
  readonly solicitudId: string
  readonly organizador: string
}

export { EventoAgenda }
export type { EventoSolicitado, EventoAprobado }

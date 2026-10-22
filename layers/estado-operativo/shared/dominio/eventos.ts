enum EventoOperativo {
  INCIDENTE_REGISTRADO = 'IncidenteRegistrado',
  ESPACIO_BLOQUEADO = 'EspacioBloqueado',
  ESPACIO_REHABILITADO = 'EspacioRehabilitado',
  ESPACIO_OCUPADO = 'EspacioOcupado',
  ESPACIO_LIBERADO = 'EspacioLiberado'
}

interface IncidenteRegistrado {
  readonly espacioId: string
  readonly nombre: string
  readonly descripcion: string
}

interface EspacioBloqueado {
  readonly espacioId: string
  readonly nombre: string
  readonly motivo: string
}

interface CambioDeOcupacion {
  readonly espacioId: string
  readonly nombre: string
}

export { EventoOperativo }
export type { IncidenteRegistrado, EspacioBloqueado, CambioDeOcupacion }

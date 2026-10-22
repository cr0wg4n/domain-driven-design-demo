enum TipoEspacio {
  ESCRITORIO_FLEXIBLE = 'ESCRITORIO_FLEXIBLE',
  ESCRITORIO_FIJO = 'ESCRITORIO_FIJO',
  SALA_REUNION = 'SALA_REUNION',
  OFICINA_PRIVADA = 'OFICINA_PRIVADA',
  SALA_COMUN = 'SALA_COMUN',
  SALA_CAPACITACION = 'SALA_CAPACITACION',
  SALON_EVENTOS = 'SALON_EVENTOS'
}

const NOMBRE_DE_TIPO: Record<TipoEspacio, string> = {
  [TipoEspacio.ESCRITORIO_FLEXIBLE]: 'Escritorio flexible',
  [TipoEspacio.ESCRITORIO_FIJO]: 'Escritorio fijo',
  [TipoEspacio.SALA_REUNION]: 'Sala de reunión',
  [TipoEspacio.OFICINA_PRIVADA]: 'Oficina privada',
  [TipoEspacio.SALA_COMUN]: 'Sala común',
  [TipoEspacio.SALA_CAPACITACION]: 'Sala de capacitación',
  [TipoEspacio.SALON_EVENTOS]: 'Salón de eventos'
}

const BUFFER_EN_MINUTOS: Record<TipoEspacio, number> = {
  [TipoEspacio.ESCRITORIO_FLEXIBLE]: 0,
  [TipoEspacio.ESCRITORIO_FIJO]: 0,
  [TipoEspacio.SALA_REUNION]: 15,
  [TipoEspacio.OFICINA_PRIVADA]: 15,
  [TipoEspacio.SALA_COMUN]: 0,
  [TipoEspacio.SALA_CAPACITACION]: 15,
  [TipoEspacio.SALON_EVENTOS]: 60
}

export { TipoEspacio, NOMBRE_DE_TIPO, BUFFER_EN_MINUTOS }

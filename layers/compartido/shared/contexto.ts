enum Contexto {
  INVENTARIO_ESPACIOS = 'INVENTARIO_ESPACIOS',
  ESTADO_OPERATIVO = 'ESTADO_OPERATIVO',
  RESERVAS = 'RESERVAS',
  EVENTOS = 'EVENTOS',
  NOTIFICACIONES = 'NOTIFICACIONES'
}

const NOMBRE_DE_CONTEXTO: Record<Contexto, string> = {
  [Contexto.INVENTARIO_ESPACIOS]: 'Inventario de espacios',
  [Contexto.ESTADO_OPERATIVO]: 'Estado operativo',
  [Contexto.RESERVAS]: 'Reservas',
  [Contexto.EVENTOS]: 'Eventos',
  [Contexto.NOTIFICACIONES]: 'Notificaciones'
}

export { Contexto, NOMBRE_DE_CONTEXTO }

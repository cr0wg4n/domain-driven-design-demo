import { Bloque, EstadoDeSolicitud } from '#eventos/shared/dominio/solicitud-de-evento'

const NOMBRE_DE_BLOQUE: Record<Bloque, string> = {
  [Bloque.MEDIO_DIA]: 'Medio día',
  [Bloque.DIA_COMPLETO]: 'Día completo'
}

const PRESENTACION_DE_SOLICITUD: Record<EstadoDeSolicitud, { etiqueta: string, color: 'success' | 'warning' }> = {
  [EstadoDeSolicitud.PENDIENTE_DE_APROBACION]: { etiqueta: 'Pendiente de aprobación', color: 'warning' },
  [EstadoDeSolicitud.CONFIRMADA]: { etiqueta: 'Confirmada', color: 'success' }
}

export { NOMBRE_DE_BLOQUE, PRESENTACION_DE_SOLICITUD }

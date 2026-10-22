import { EstadoOperativo } from '#estado-operativo/shared/dominio/espacio-operativo'

interface PresentacionDeEstado {
  readonly etiqueta: string
  readonly color: 'success' | 'neutral' | 'warning'
  readonly icono: string
}

const PRESENTACION_DE_ESTADO: Record<EstadoOperativo, PresentacionDeEstado> = {
  [EstadoOperativo.LIBRE_AHORA]: { etiqueta: 'Libre ahora', color: 'success', icono: 'i-lucide-circle' },
  [EstadoOperativo.OCUPADO]: { etiqueta: 'Ocupado', color: 'neutral', icono: 'i-lucide-user-round' },
  [EstadoOperativo.EN_MANTENIMIENTO]: { etiqueta: 'En mantenimiento', color: 'warning', icono: 'i-lucide-wrench' }
}

export { PRESENTACION_DE_ESTADO }
export type { PresentacionDeEstado }

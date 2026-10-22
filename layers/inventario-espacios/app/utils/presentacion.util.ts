import { EstadoEnInventario } from '#inventario-espacios/shared/dominio/espacio'
import type { DatosDeEspacio } from '#inventario-espacios/shared/dominio/espacio'

const PRESENTACION_DE_ESTADO: Record<EstadoEnInventario, { etiqueta: string, color: 'neutral' | 'success' | 'warning' }> = {
  [EstadoEnInventario.REGISTRADO]: { etiqueta: 'Registrado', color: 'warning' },
  [EstadoEnInventario.HABILITADO]: { etiqueta: 'Habilitado', color: 'success' },
  [EstadoEnInventario.DADO_DE_BAJA]: { etiqueta: 'Dado de baja', color: 'neutral' }
}

function estaDadoDeBaja(espacio: DatosDeEspacio): boolean {
  return espacio.estado === EstadoEnInventario.DADO_DE_BAJA
}

function sePuedeHabilitar(espacio: DatosDeEspacio): boolean {
  return espacio.estado === EstadoEnInventario.REGISTRADO
}

function textoDeBuffer(espacio: DatosDeEspacio): string {
  return espacio.bufferEnMinutos ? `${espacio.bufferEnMinutos} min` : 'Sin buffer'
}

export { PRESENTACION_DE_ESTADO, estaDadoDeBaja, sePuedeHabilitar, textoDeBuffer }

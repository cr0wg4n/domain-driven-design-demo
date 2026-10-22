import type { DatosDeEspacioOperativo } from '#estado-operativo/shared/dominio/espacio-operativo'
import { consultar } from '#compartido/app/services/api.service'

const RUTA_DE_ESPACIOS = '/api/estado-operativo/espacios'

const rutaDeComando = {
  registrarIncidente: (id: string) => `${RUTA_DE_ESPACIOS}/${id}/incidente`,
  bloquear: (id: string) => `${RUTA_DE_ESPACIOS}/${id}/bloquear`,
  rehabilitar: (id: string) => `${RUTA_DE_ESPACIOS}/${id}/rehabilitar`,
  marcarOcupado: (id: string) => `${RUTA_DE_ESPACIOS}/${id}/ocupar`,
  liberar: (id: string) => `${RUTA_DE_ESPACIOS}/${id}/liberar`
}

async function listarEspaciosOperativos(): Promise<DatosDeEspacioOperativo[]> {
  return await consultar<DatosDeEspacioOperativo[]>(RUTA_DE_ESPACIOS)
}

export { listarEspaciosOperativos, rutaDeComando }

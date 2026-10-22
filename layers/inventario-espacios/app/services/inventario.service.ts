import type { DatosDeEspacio } from '#inventario-espacios/shared/dominio/espacio'
import { consultar } from '#compartido/app/services/api.service'

const RUTA_DE_ESPACIOS = '/api/inventario/espacios'

const rutaDeComando = {
  registrar: () => RUTA_DE_ESPACIOS,
  habilitar: (id: string) => `${RUTA_DE_ESPACIOS}/${id}/habilitar`,
  cambiarAforo: (id: string) => `${RUTA_DE_ESPACIOS}/${id}/aforo`,
  darDeBaja: (id: string) => `${RUTA_DE_ESPACIOS}/${id}/dar-de-baja`
}

async function listarEspacios(): Promise<DatosDeEspacio[]> {
  return await consultar<DatosDeEspacio[]>(RUTA_DE_ESPACIOS)
}

export { listarEspacios, rutaDeComando }

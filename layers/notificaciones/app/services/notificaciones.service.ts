import type { Aviso } from '#notificaciones/shared/aviso'
import { consultar } from '#compartido/app/services/api.service'

const RUTA_DE_AVISOS = '/api/notificaciones'

async function listarAvisos(): Promise<Aviso[]> {
  return await consultar<Aviso[]>(RUTA_DE_AVISOS)
}

export { listarAvisos }

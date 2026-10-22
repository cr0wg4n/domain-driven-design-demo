import type { DatosDeSolicitud, Salon } from '#eventos/shared/dominio/solicitud-de-evento'
import { consultar } from '#compartido/app/services/api.service'

const RUTA_DE_EVENTOS = '/api/eventos'

interface Agenda {
  salon: Salon | null
  solicitudes: DatosDeSolicitud[]
}

const rutaDeComando = {
  solicitar: () => RUTA_DE_EVENTOS,
  aprobar: (id: string) => `${RUTA_DE_EVENTOS}/${id}/aprobar`
}

async function leerAgenda(): Promise<Agenda> {
  return await consultar<Agenda>(RUTA_DE_EVENTOS)
}

export { leerAgenda, rutaDeComando }
export type { Agenda }

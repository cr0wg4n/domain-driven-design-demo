import type { TipoEspacio } from './tipo-espacio'

enum EventoInventario {
  ESPACIO_REGISTRADO = 'EspacioRegistrado',
  ESPACIO_HABILITADO = 'EspacioHabilitado',
  AFORO_MODIFICADO = 'AforoModificado',
  ESPACIO_DADO_DE_BAJA = 'EspacioDadoDeBaja'
}

interface EspacioRegistrado {
  readonly espacioId: string
  readonly nombre: string
  readonly tipo: TipoEspacio
  readonly aforo: number
}

interface EspacioHabilitado {
  readonly espacioId: string
  readonly nombre: string
  readonly tipo: TipoEspacio
  readonly aforo: number
  readonly bufferEnMinutos: number
}

interface AforoModificado {
  readonly espacioId: string
  readonly tipo: TipoEspacio
  readonly aforoAnterior: number
  readonly aforoNuevo: number
}

interface EspacioDadoDeBaja {
  readonly espacioId: string
  readonly nombre: string
}

export { EventoInventario }
export type { EspacioRegistrado, EspacioHabilitado, AforoModificado, EspacioDadoDeBaja }

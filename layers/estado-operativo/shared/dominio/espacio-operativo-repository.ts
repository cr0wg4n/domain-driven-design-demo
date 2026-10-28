import type { EspacioOperativo } from './espacio-operativo'

interface EspacioOperativoRepository {
  buscarPorId(espacioId: string): EspacioOperativo | undefined
  listar(): EspacioOperativo[]
  guardar(espacio: EspacioOperativo): void
  eliminar(espacioId: string): void
  vaciar(): void
}

export type { EspacioOperativoRepository }

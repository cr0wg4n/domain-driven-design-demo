import type { Espacio } from './espacio'

interface EspacioRepository {
  buscarPorId(id: string): Espacio | undefined
  listar(): Espacio[]
  guardar(espacio: Espacio): void
  vaciar(): void
}

export type { EspacioRepository }

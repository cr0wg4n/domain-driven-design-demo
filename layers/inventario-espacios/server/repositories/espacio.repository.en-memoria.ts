import type { Espacio } from '#inventario-espacios/shared/dominio/espacio'
import type { EspacioRepository } from '#inventario-espacios/shared/dominio/espacio-repository'

class EspacioRepositoryEnMemoria implements EspacioRepository {
  private readonly espacios = new Map<string, Espacio>()

  buscarPorId(id: string): Espacio | undefined {
    return this.espacios.get(id)
  }

  listar(): Espacio[] {
    return [...this.espacios.values()]
  }

  guardar(espacio: Espacio): void {
    this.espacios.set(espacio.id, espacio)
  }

  vaciar(): void {
    this.espacios.clear()
  }
}

export { EspacioRepositoryEnMemoria }

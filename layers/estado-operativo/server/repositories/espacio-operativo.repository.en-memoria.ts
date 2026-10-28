import type { EspacioOperativo } from '#estado-operativo/shared/dominio/espacio-operativo'
import type { EspacioOperativoRepository } from '#estado-operativo/shared/dominio/espacio-operativo-repository'

class EspacioOperativoRepositoryEnMemoria implements EspacioOperativoRepository {
  private readonly espacios = new Map<string, EspacioOperativo>()

  buscarPorId(espacioId: string): EspacioOperativo | undefined {
    return this.espacios.get(espacioId)
  }

  listar(): EspacioOperativo[] {
    return [...this.espacios.values()]
  }

  guardar(espacio: EspacioOperativo): void {
    this.espacios.set(espacio.espacioId, espacio)
  }

  eliminar(espacioId: string): void {
    this.espacios.delete(espacioId)
  }

  vaciar(): void {
    this.espacios.clear()
  }
}

export { EspacioOperativoRepositoryEnMemoria }

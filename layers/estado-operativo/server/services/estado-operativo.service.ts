import { Rol } from '#compartido/shared/rol'
import type { EventoDeDominio } from '#compartido/shared/evento-de-dominio'
import type { Resultado } from '#compartido/shared/resultado'
import { publicar } from '#compartido/server/utils/bus-de-eventos'
import { exigir, noEncontrado } from '#compartido/server/utils/comando'
import { EspacioOperativo } from '#estado-operativo/shared/dominio/espacio-operativo'
import type { DatosDeEspacioOperativo } from '#estado-operativo/shared/dominio/espacio-operativo'
import type { EspacioOperativoRepository } from '#estado-operativo/shared/dominio/espacio-operativo-repository'
import type { CambioDeOcupacion, EspacioBloqueado, IncidenteRegistrado } from '#estado-operativo/shared/dominio/eventos'
import { EspacioOperativoRepositoryEnMemoria } from '#estado-operativo/server/repositories/espacio-operativo.repository.en-memoria'

const OCUPADOS_AL_ABRIR = ['Sala de reunión A', 'Escritorio flexible 1', 'Escritorio flexible 2']

class EstadoOperativoService {
  constructor(private readonly espacios: EspacioOperativoRepository) {}

  incorporar(espacioId: string, nombre: string): void {
    this.espacios.guardar(EspacioOperativo.incorporar(espacioId, nombre))
  }

  retirar(espacioId: string): void {
    this.espacios.eliminar(espacioId)
  }

  registrarIncidente(espacioId: string, descripcion: string, quien: Rol): EventoDeDominio<IncidenteRegistrado> {
    return this.ejecutar(espacioId, espacio => espacio.registrarIncidente(descripcion, quien))
  }

  bloquear(espacioId: string, quien: Rol): EventoDeDominio<EspacioBloqueado> {
    return this.ejecutar(espacioId, espacio => espacio.bloquear(quien))
  }

  rehabilitar(espacioId: string, quien: Rol): EventoDeDominio<CambioDeOcupacion> {
    return this.ejecutar(espacioId, espacio => espacio.rehabilitar(quien))
  }

  marcarOcupado(espacioId: string, quien: Rol): EventoDeDominio<CambioDeOcupacion> {
    return this.ejecutar(espacioId, espacio => espacio.marcarOcupado(quien))
  }

  liberar(espacioId: string, quien: Rol): EventoDeDominio<CambioDeOcupacion> {
    return this.ejecutar(espacioId, espacio => espacio.liberar(quien))
  }

  listar(): DatosDeEspacioOperativo[] {
    return this.espacios.listar().map(espacio => espacio.aDatos())
  }

  sembrarOcupacion(): void {
    this.espacios.listar()
      .filter(espacio => OCUPADOS_AL_ABRIR.includes(espacio.nombre))
      .forEach(espacio => this.marcarOcupado(espacio.espacioId, Rol.RECEPCION))
  }

  reiniciar(): void {
    this.espacios.vaciar()
  }

  private ejecutar<D>(espacioId: string, comando: (espacio: EspacioOperativo) => Resultado<EventoDeDominio<D>>): EventoDeDominio<D> {
    const espacio = this.espacios.buscarPorId(espacioId) ?? noEncontrado('El espacio')
    const evento = exigir(comando(espacio))
    this.espacios.guardar(espacio)
    publicar(evento)
    return evento
  }
}

const estadoOperativoService = new EstadoOperativoService(new EspacioOperativoRepositoryEnMemoria())

export { EstadoOperativoService, estadoOperativoService }

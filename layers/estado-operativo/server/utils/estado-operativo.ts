import { Rol } from '#compartido/shared/rol'
import { publicar } from '#compartido/server/utils/bus-de-eventos'
import { exigir, noEncontrado } from '#compartido/server/utils/comando'
import { EspacioOperativo } from '#estado-operativo/shared/dominio/espacio-operativo'

const espacios = new Map<string, EspacioOperativo>()

const OCUPADOS_AL_ABRIR = ['Sala de reunión A', 'Escritorio flexible 1', 'Escritorio flexible 2']

function incorporarEspacio(espacioId: string, nombre: string): void {
  espacios.set(espacioId, EspacioOperativo.incorporar(espacioId, nombre))
}

function retirarEspacio(espacioId: string): void {
  espacios.delete(espacioId)
}

function buscarEspacioOperativo(espacioId: string): EspacioOperativo {
  return espacios.get(espacioId) ?? noEncontrado('El espacio')
}

function listarEspaciosOperativos(): EspacioOperativo[] {
  return [...espacios.values()]
}

function sembrarOcupacion(): void {
  listarEspaciosOperativos()
    .filter(espacio => OCUPADOS_AL_ABRIR.includes(espacio.nombre))
    .forEach(espacio => publicar(exigir(espacio.marcarOcupado(Rol.RECEPCION))))
}

function vaciarEstadoOperativo(): void {
  espacios.clear()
}

export {
  incorporarEspacio,
  retirarEspacio,
  buscarEspacioOperativo,
  listarEspaciosOperativos,
  sembrarOcupacion,
  vaciarEstadoOperativo
}

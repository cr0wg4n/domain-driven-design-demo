import type { Contexto } from '#compartido/shared/contexto'
import type { EventoDeDominio } from '#compartido/shared/evento-de-dominio'

type Reaccion = (evento: EventoDeDominio) => void

interface Suscripcion {
  readonly contexto: Contexto
  readonly nombreEvento: string
  readonly reaccion: Reaccion
}

const suscripciones: Suscripcion[] = []

function suscribir(contexto: Contexto, nombreEvento: string, reaccion: Reaccion): void {
  suscripciones.push({ contexto, nombreEvento, reaccion })
}

function publicar(evento: EventoDeDominio): void {
  suscripciones
    .filter(suscripcion => suscripcion.nombreEvento === evento.nombre)
    .forEach(suscripcion => suscripcion.reaccion(evento))
}

export { suscribir, publicar }

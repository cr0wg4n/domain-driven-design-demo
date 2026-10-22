import { createError, getCookie, getHeader, getRouterParam, readBody } from 'h3'
import type { H3Event } from 'h3'
import { Rol, esRol } from '#compartido/shared/rol'
import type { Resultado } from '#compartido/shared/resultado'
import { COOKIE_DE_SESION, sesionDe } from '#compartido/shared/sesion'
import type { Sesion } from '#compartido/shared/sesion'

const CABECERA_DE_ROL = 'x-rol'

function leerRol(event: H3Event): Rol {
  const rol = getHeader(event, CABECERA_DE_ROL) ?? getCookie(event, COOKIE_DE_SESION)
  return esRol(rol) ? rol : Rol.MIEMBRO
}

function leerSesion(event: H3Event): Sesion {
  return sesionDe(leerRol(event))
}

function leerId(event: H3Event): string {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Falta el identificador' })
  return id
}

async function leerCuerpo<T>(event: H3Event): Promise<T> {
  return (await readBody<T>(event)) ?? ({} as T)
}

function noEncontrado(que: string): never {
  throw createError({ statusCode: 404, statusMessage: `${que} no existe` })
}

function exigir<T>(resultado: Resultado<T>): T {
  if (!resultado.esExitoso) {
    throw createError({ statusCode: 422, statusMessage: 'Comando rechazado', data: { motivo: resultado.motivo } })
  }
  return resultado.valor
}

export { CABECERA_DE_ROL, leerRol, leerSesion, leerId, leerCuerpo, noEncontrado, exigir }

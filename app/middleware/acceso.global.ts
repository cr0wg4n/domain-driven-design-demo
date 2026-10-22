import { defineNuxtRouteMiddleware, navigateTo } from '#imports'
import { useSesionStore } from '#compartido/app/stores/sesion.store'
import { puedeVer, rutaDeInicio } from '~/constants/secciones'

export default defineNuxtRouteMiddleware((destino) => {
  const { rol } = useSesionStore()
  if (!puedeVer(rol, destino.path)) return navigateTo(rutaDeInicio(rol))
})

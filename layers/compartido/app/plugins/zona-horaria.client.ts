import { defineNuxtPlugin } from '#imports'
import { COOKIE_DE_ZONA } from '#compartido/shared/zona-horaria'

const UN_ANIO_EN_SEGUNDOS = 60 * 60 * 24 * 365

function zonaGuardada(): string | undefined {
  const valor = document.cookie
    .split('; ')
    .find(cookie => cookie.startsWith(`${COOKIE_DE_ZONA}=`))
    ?.split('=')[1]
  return valor ? decodeURIComponent(valor) : undefined
}

export default defineNuxtPlugin(() => {
  const zonaDelNavegador = Intl.DateTimeFormat().resolvedOptions().timeZone
  if (zonaGuardada() === zonaDelNavegador) return

  document.cookie = `${COOKIE_DE_ZONA}=${encodeURIComponent(zonaDelNavegador)}; path=/; max-age=${UN_ANIO_EN_SEGUNDOS}; samesite=lax`
  if (zonaGuardada() === zonaDelNavegador) window.location.reload()
})

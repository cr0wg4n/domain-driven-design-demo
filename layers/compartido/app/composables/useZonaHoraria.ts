import { computed } from 'vue'
import { useCookie } from '#imports'
import * as zonaHoraria from '#compartido/shared/zona-horaria'
import { COOKIE_DE_ZONA, ZONA_POR_DEFECTO, esZonaValida } from '#compartido/shared/zona-horaria'
import type { Instante } from '#compartido/shared/zona-horaria'

function useZonaHoraria() {
  const cookie = useCookie<string | undefined>(COOKIE_DE_ZONA, { readonly: true })
  const zona = computed(() => (esZonaValida(cookie.value) ? cookie.value : ZONA_POR_DEFECTO))

  return {
    claveDeDia: (instante: Instante) => zonaHoraria.claveDeDia(instante, zona.value),
    claveDeHoy: () => zonaHoraria.claveDeDia(new Date(), zona.value),
    sumarDias: (clave: string, dias: number) => zonaHoraria.sumarDias(clave, dias, zona.value),
    nombreDelDia: (clave: string) => zonaHoraria.nombreDelDia(clave, zona.value),
    instanteEnDia: (clave: string, horas: number, minutos: number) => zonaHoraria.instanteEnDia(clave, horas, minutos, zona.value),
    minutosDelDia: (instante: Instante) => zonaHoraria.minutosDelDia(instante, zona.value),
    hora: (instante: Instante) => zonaHoraria.hora(instante, zona.value)
  }
}

export { useZonaHoraria }

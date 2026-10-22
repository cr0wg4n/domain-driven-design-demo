<script setup lang="ts">
import { computed } from 'vue'
import { useZonaHoraria } from '#compartido/app/composables/useZonaHoraria'
import { EstadoReserva } from '#reservas/shared/dominio/reserva'
import type { ReservaEnCalendario } from '#reservas/shared/dominio/reserva-en-calendario'
import type { RecursoReservable } from '#reservas/shared/dominio/recurso-reservable'
import { MINUTOS_DE_LA_JORNADA, minutosDesdeApertura } from '#reservas/app/utils/franja.util'
import ReservaReasignacion from '#reservas/app/components/ReservaReasignacion.vue'

interface ReservaBloqueProps {
  reserva: ReservaEnCalendario
  bufferEnMinutos: number
  recursosQueSePuedenReservar: RecursoReservable[]
  puedeReasignar: boolean
}

interface ReservaBloqueEmits {
  (event: 'cancelar'): void
  (event: 'reasignar', recursoId: string): void
}

const props = defineProps<ReservaBloqueProps>()
const emit = defineEmits<ReservaBloqueEmits>()
const { hora, minutosDelDia } = useZonaHoraria()

const esAjena = computed(() => props.reserva.titular === null)
const estaPorReasignar = computed(() => props.reserva.estado === EstadoReserva.POR_REASIGNAR)
const franja = computed(() => `${hora(props.reserva.franja.inicio)} a ${hora(props.reserva.franja.fin)}`)

function porcentaje(minutos: number): string {
  return `${(minutos / MINUTOS_DE_LA_JORNADA) * 100}%`
}

const posicion = computed(() => {
  const inicio = minutosDesdeApertura(minutosDelDia(props.reserva.franja.inicio))
  const fin = minutosDesdeApertura(minutosDelDia(props.reserva.franja.fin))
  return { left: porcentaje(inicio), width: porcentaje(fin - inicio) }
})

const posicionDelBuffer = computed(() => ({
  left: porcentaje(minutosDesdeApertura(minutosDelDia(props.reserva.franja.fin))),
  width: porcentaje(props.bufferEnMinutos)
}))

function handleCancelar(): void {
  emit('cancelar')
}

function handleReasignar(recursoId: string): void {
  emit('reasignar', recursoId)
}
</script>

<template>
  <div v-if="bufferEnMinutos" class="absolute inset-y-2 rounded-r-sm bg-primary-200/40" :style="posicionDelBuffer" />
  <div
    v-if="esAjena"
    class="absolute inset-y-1.5 flex items-center rounded-sm border border-default bg-elevated px-2 text-xs text-muted"
    :style="posicion"
  >
    Reservado
  </div>
  <UPopover v-else>
    <button
      type="button"
      class="absolute inset-y-1.5 overflow-hidden rounded-sm border px-2 text-left text-xs transition-colors"
      :class="estaPorReasignar
        ? 'border-warning/60 bg-warning/15 text-highlighted hover:bg-warning/25'
        : 'border-primary-400 bg-primary-100 text-primary-900 hover:bg-primary-200'"
      :style="posicion"
    >
      <span class="block truncate font-medium">{{ reserva.titular }}</span>
      <span class="block truncate opacity-75">{{ franja }}</span>
    </button>
    <template #content>
      <div class="w-72 space-y-3 p-4">
        <div>
          <p class="font-medium">{{ reserva.titular }}</p>
          <p class="text-sm text-muted">{{ reserva.recurso }}, {{ franja }}</p>
        </div>
        <template v-if="estaPorReasignar">
          <UBadge label="Por reasignar" color="warning" variant="subtle" />
          <ReservaReasignacion
            v-if="puedeReasignar"
            :recursos="recursosQueSePuedenReservar"
            :recurso-actual-id="reserva.recursoId"
            @reasignar="handleReasignar"
          />
          <p v-else class="text-sm text-muted">Esperando reasignación</p>
        </template>
        <UButton v-else label="Cancelar reserva" color="neutral" variant="outline" size="sm" block @click="handleCancelar" />
      </div>
    </template>
  </UPopover>
</template>

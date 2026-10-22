<script setup lang="ts">
import type { ReservaEnCalendario } from '#reservas/shared/dominio/reserva-en-calendario'
import type { RecursoReservable } from '#reservas/shared/dominio/recurso-reservable'
import { MINUTOS_DE_LA_JORNADA, horaDesdeMinutos, horasDeLaJornada } from '#reservas/app/utils/franja.util'
import ReservaBloque from '#reservas/app/components/ReservaBloque.vue'

interface ReservasCalendarioProps {
  recursos: RecursoReservable[]
  reservas: ReservaEnCalendario[]
  recursosQueSePuedenReservar: RecursoReservable[]
  puedeReasignar: boolean
}

interface ReservasCalendarioEmits {
  (event: 'elegirFranja', payload: { recursoId: string, desde: string }): void
  (event: 'cancelar', id: string): void
  (event: 'reasignar', payload: { id: string, recursoId: string }): void
}

const props = defineProps<ReservasCalendarioProps>()
const emit = defineEmits<ReservasCalendarioEmits>()

const MINUTOS_POR_CASILLA = 30
const HORAS = horasDeLaJornada()
const LINEAS_DE_HORA = { backgroundSize: `${100 / HORAS.length}% 100%` }

function reservasDe(recursoId: string): ReservaEnCalendario[] {
  return props.reservas.filter(reserva => reserva.recursoId === recursoId)
}

function posicionDeHora(indice: number): { left: string } {
  return { left: `${(indice / HORAS.length) * 100}%` }
}

function handleElegirFranja(evento: MouseEvent, recurso: RecursoReservable): void {
  if (!recurso.sePuedeReservar) return
  const fila = evento.currentTarget as HTMLElement
  const proporcion = evento.offsetX / fila.clientWidth
  const minutos = Math.floor((proporcion * MINUTOS_DE_LA_JORNADA) / MINUTOS_POR_CASILLA) * MINUTOS_POR_CASILLA
  emit('elegirFranja', { recursoId: recurso.recursoId, desde: horaDesdeMinutos(minutos) })
}

function handleCancelar(id: string): void {
  emit('cancelar', id)
}

function handleReasignar(id: string, recursoId: string): void {
  emit('reasignar', { id, recursoId })
}
</script>

<template>
  <div class="overflow-x-auto rounded-md border border-default bg-default">
    <div class="min-w-[56rem]">
      <div class="flex border-b border-default text-xs text-muted">
        <div class="w-44 shrink-0 px-3 py-2 font-medium">Espacio</div>
        <div class="relative h-8 flex-1">
          <span
            v-for="(horaDelDia, indice) in HORAS"
            :key="horaDelDia"
            class="absolute top-2 -translate-x-1/2 tabular-nums"
            :style="posicionDeHora(indice)"
          >{{ horaDelDia }}:00</span>
        </div>
      </div>
      <div
        v-for="recurso in recursos"
        :key="recurso.recursoId"
        class="flex border-b border-default last:border-b-0"
      >
        <div class="flex w-44 shrink-0 flex-col justify-center px-3 py-2">
          <span class="truncate text-sm">{{ recurso.nombre }}</span>
          <span v-if="!recurso.sePuedeReservar" class="text-xs text-warning">En mantenimiento</span>
        </div>
        <div
          class="relative h-14 flex-1 overflow-hidden bg-[linear-gradient(to_right,var(--ui-border)_1px,transparent_1px)]"
          :style="LINEAS_DE_HORA"
          :class="recurso.sePuedeReservar ? 'cursor-pointer hover:bg-elevated/50' : 'bg-elevated/60'"
          @click.self="handleElegirFranja($event, recurso)"
        >
          <ReservaBloque
            v-for="reserva in reservasDe(recurso.recursoId)"
            :key="reserva.id"
            :reserva="reserva"
            :buffer-en-minutos="recurso.bufferEnMinutos"
            :recursos-que-se-pueden-reservar="recursosQueSePuedenReservar"
            :puede-reasignar="puedeReasignar"
            @cancelar="handleCancelar(reserva.id)"
            @reasignar="handleReasignar(reserva.id, $event)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

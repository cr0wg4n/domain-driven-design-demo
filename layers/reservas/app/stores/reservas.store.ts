import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { EstadoReserva } from '#reservas/shared/dominio/reserva'
import type { ReservaEnCalendario } from '#reservas/shared/dominio/reserva-en-calendario'
import type { RecursoReservable } from '#reservas/shared/dominio/recurso-reservable'
import { listarRecursos, listarReservas } from '#reservas/app/services/reservas.service'
import { useZonaHoraria } from '#compartido/app/composables/useZonaHoraria'

const useReservasStore = defineStore('reservas', () => {
  const { claveDeDia, claveDeHoy, sumarDias } = useZonaHoraria()
  const reservas = ref<ReservaEnCalendario[]>([])
  const recursos = ref<RecursoReservable[]>([])
  const diaSeleccionado = ref(claveDeHoy())

  const recursosQueSePuedenReservar = computed(() => recursos.value.filter(recurso => recurso.sePuedeReservar))
  const esHoy = computed(() => diaSeleccionado.value === claveDeHoy())

  const reservasDelDia = computed(() =>
    reservas.value.filter(reserva =>
      reserva.estado !== EstadoReserva.CANCELADA && claveDeDia(reserva.franja.inicio) === diaSeleccionado.value
    )
  )

  async function cargar(): Promise<void> {
    const [nuevasReservas, nuevosRecursos] = await Promise.all([listarReservas(), listarRecursos()])
    reservas.value = nuevasReservas
    recursos.value = nuevosRecursos
  }

  function moverDia(dias: number): void {
    diaSeleccionado.value = sumarDias(diaSeleccionado.value, dias)
  }

  function irAHoy(): void {
    diaSeleccionado.value = claveDeHoy()
  }

  return { reservas, recursos, diaSeleccionado, recursosQueSePuedenReservar, esHoy, reservasDelDia, cargar, moverDia, irAHoy }
})

export { useReservasStore }

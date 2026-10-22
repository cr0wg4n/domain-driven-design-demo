<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import type { RecursoReservable } from '#reservas/shared/dominio/recurso-reservable'
import type { PedidoDeReservaEnviado } from '#reservas/app/services/reservas.service'
import { useZonaHoraria } from '#compartido/app/composables/useZonaHoraria'
import { leerHora } from '#reservas/app/utils/franja.util'

interface FranjaElegida {
  recursoId: string
  desde: string
}

interface ReservaFormularioProps {
  recursos: RecursoReservable[]
  dia: string
  franjaElegida: FranjaElegida | null
  titularFijo: string | null
}

interface ReservaFormularioEmits {
  (event: 'reservar', pedido: PedidoDeReservaEnviado): void
}

const props = defineProps<ReservaFormularioProps>()
const emit = defineEmits<ReservaFormularioEmits>()
const estaAbierto = defineModel<boolean>('open', { default: false })
const { nombreDelDia, instanteEnDia } = useZonaHoraria()

const formulario = reactive({ recursoId: '', titular: '', desde: '10:00', hasta: '11:00' })

const opcionesDeRecurso = computed(() =>
  props.recursos.map(recurso => ({ label: recurso.nombre, value: recurso.recursoId }))
)
const descripcion = computed(() => `Reserva para el ${nombreDelDia(props.dia)}. Se respeta el buffer de limpieza del espacio.`)

function unaHoraDespues(hora: string): string {
  const [horas = 0, minutos = 0] = hora.split(':').map(Number)
  return `${String(Math.min(horas + 1, 23)).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`
}

function instanteDe(hora: string): string {
  const [horas, minutos] = leerHora(hora)
  return instanteEnDia(props.dia, horas, minutos)
}

function prepararFormulario(abierto: boolean): void {
  if (!abierto) return
  formulario.titular = props.titularFijo ?? ''
  formulario.recursoId = props.franjaElegida?.recursoId ?? ''
  formulario.desde = props.franjaElegida?.desde ?? '10:00'
  formulario.hasta = unaHoraDespues(formulario.desde)
}

function handleReservar(): void {
  emit('reservar', {
    recursoId: formulario.recursoId,
    titular: formulario.titular,
    franja: { inicio: instanteDe(formulario.desde), fin: instanteDe(formulario.hasta) }
  })
  estaAbierto.value = false
}

watch(estaAbierto, prepararFormulario)
</script>

<template>
  <UModal v-model:open="estaAbierto" title="Nueva reserva" :description="descripcion">
    <template #body>
      <form id="nueva-reserva" class="space-y-4" @submit.prevent="handleReservar">
        <UFormField label="Espacio">
          <USelect v-model="formulario.recursoId" :items="opcionesDeRecurso" placeholder="Elige un espacio" class="w-full" />
        </UFormField>
        <UFormField v-if="!titularFijo" label="Titular">
          <UInput v-model="formulario.titular" placeholder="Nombre de quien reserva" class="w-full" />
        </UFormField>
        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Desde">
            <UInput v-model="formulario.desde" type="time" class="w-full" />
          </UFormField>
          <UFormField label="Hasta">
            <UInput v-model="formulario.hasta" type="time" class="w-full" />
          </UFormField>
        </div>
      </form>
    </template>
    <template #footer>
      <UButton type="submit" form="nueva-reserva" label="Reservar" />
    </template>
  </UModal>
</template>

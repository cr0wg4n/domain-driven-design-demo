<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { usePermisos } from '#compartido/app/composables/usePermisos'
import { useSesionStore } from '#compartido/app/stores/sesion.store'
import { useSincronizacionStore } from '#compartido/app/stores/sincronizacion.store'
import { EstadoReserva, QUIENES_REASIGNAN } from '#reservas/shared/dominio/reserva'
import type { PedidoDeReservaEnviado } from '#reservas/app/services/reservas.service'
import ReservaFormulario from '#reservas/app/components/ReservaFormulario.vue'
import ReservasCalendario from '#reservas/app/components/ReservasCalendario.vue'
import ReservasNavegadorDia from '#reservas/app/components/ReservasNavegadorDia.vue'
import { useReservas } from '#reservas/app/composables/useReservas'
import { useReservasStore } from '#reservas/app/stores/reservas.store'

interface FranjaElegida {
  recursoId: string
  desde: string
}

const formularioAbierto = ref(false)
const franjaElegida = ref<FranjaElegida | null>(null)

const store = useReservasStore()
const sesion = useSesionStore()
const sincronizacion = useSincronizacionStore()
const { reservar, cancelar, reasignar } = useReservas()
const { puede } = usePermisos()

const puedeReasignar = computed(() => puede(QUIENES_REASIGNAN))
const titularFijo = computed(() => sesion.esMiembro ? sesion.nombre : null)
const cantidadPorReasignar = computed(() => store.reservasDelDia.filter(r => r.estado === EstadoReserva.POR_REASIGNAR).length)
const resumenDelDia = computed(() => {
  const total = store.reservasDelDia.length
  const porReasignar = cantidadPorReasignar.value ? `, ${cantidadPorReasignar.value} por reasignar` : ''
  return `${total} ${total === 1 ? 'reserva' : 'reservas'}${porReasignar}`
})

function abrirFormulario(franja: FranjaElegida | null): void {
  franjaElegida.value = franja
  formularioAbierto.value = true
}

function handleNuevaReserva(): void {
  abrirFormulario(null)
}

function handleElegirFranja(franja: FranjaElegida): void {
  abrirFormulario(franja)
}

function handleMoverDia(dias: number): void {
  store.moverDia(dias)
}

function handleIrAHoy(): void {
  store.irAHoy()
}

async function handleReservar(pedido: PedidoDeReservaEnviado): Promise<void> {
  await reservar(pedido)
}

async function handleCancelar(id: string): Promise<void> {
  await cancelar(id)
}

async function handleReasignar({ id, recursoId }: { id: string, recursoId: string }): Promise<void> {
  await reasignar(id, recursoId)
}

watch(() => sincronizacion.version, store.cargar)
watch(() => sesion.rol, store.cargar)

onMounted(store.cargar)
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold">Reservas</h1>
        <p class="mt-1 text-muted">{{ resumenDelDia }}</p>
      </div>
      <UButton label="Nueva reserva" icon="i-lucide-plus" @click="handleNuevaReserva" />
    </div>
    <ReservasNavegadorDia
      :dia="store.diaSeleccionado"
      :es-hoy="store.esHoy"
      @mover="handleMoverDia"
      @ir-a-hoy="handleIrAHoy"
    />
    <ReservasCalendario
      :recursos="store.recursos"
      :reservas="store.reservasDelDia"
      :recursos-que-se-pueden-reservar="store.recursosQueSePuedenReservar"
      :puede-reasignar="puedeReasignar"
      @elegir-franja="handleElegirFranja"
      @cancelar="handleCancelar"
      @reasignar="handleReasignar"
    />
    <ReservaFormulario
      v-model:open="formularioAbierto"
      :recursos="store.recursosQueSePuedenReservar"
      :dia="store.diaSeleccionado"
      :franja-elegida="franjaElegida"
      :titular-fijo="titularFijo"
      @reservar="handleReservar"
    />
  </div>
</template>

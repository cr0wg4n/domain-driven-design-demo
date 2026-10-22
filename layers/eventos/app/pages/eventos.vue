<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useSincronizacionStore } from '#compartido/app/stores/sincronizacion.store'
import { usePermisos } from '#compartido/app/composables/usePermisos'
import { QUIENES_APRUEBAN } from '#eventos/shared/dominio/solicitud-de-evento'
import type { PedidoDeEvento } from '#eventos/shared/dominio/solicitud-de-evento'
import AgendaFormularioSolicitud from '#eventos/app/components/AgendaFormularioSolicitud.vue'
import AgendaSolicitudes from '#eventos/app/components/AgendaSolicitudes.vue'
import { useAgenda } from '#eventos/app/composables/useAgenda'
import { useAgendaStore } from '#eventos/app/stores/agenda.store'

const store = useAgendaStore()
const sincronizacion = useSincronizacionStore()
const { solicitar, aprobar } = useAgenda()
const { puede } = usePermisos()

const puedeAprobar = computed(() => puede(QUIENES_APRUEBAN))

const estadoDelSalon = computed(() => {
  if (!store.salon) return 'El salón todavía no está habilitado'
  const uso = store.salon.sePuedeUsar ? 'disponible para eventos' : 'en mantenimiento'
  return `Salón ${uso}, aforo de ${store.salon.aforo} personas`
})

async function handleSolicitar(pedido: PedidoDeEvento): Promise<void> {
  await solicitar(pedido)
}

async function handleAprobar(id: string): Promise<void> {
  await aprobar(id)
}

watch(() => sincronizacion.version, store.cargar)

onMounted(store.cargar)
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold">Eventos</h1>
        <p class="mt-1 text-muted">Solicitudes de alquiler del salón</p>
      </div>
      <AgendaFormularioSolicitud @solicitar="handleSolicitar" />
    </div>
    <UAlert :title="estadoDelSalon" icon="i-lucide-presentation" color="neutral" variant="subtle" />
    <AgendaSolicitudes :solicitudes="store.solicitudes" :puede-aprobar="puedeAprobar" @aprobar="handleAprobar" />
  </div>
</template>

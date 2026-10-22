<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useSesionStore } from '#compartido/app/stores/sesion.store'
import { useSincronizacionStore } from '#compartido/app/stores/sincronizacion.store'
import { useZonaHoraria } from '#compartido/app/composables/useZonaHoraria'
import { EstadoEnInventario } from '#inventario-espacios/shared/dominio/espacio'
import { useInventarioStore } from '#inventario-espacios/app/stores/inventario.store'
import { EstadoOperativo } from '#estado-operativo/shared/dominio/espacio-operativo'
import { useEstadoOperativoStore } from '#estado-operativo/app/stores/estado-operativo.store'
import { EstadoReserva } from '#reservas/shared/dominio/reserva'
import { useReservasStore } from '#reservas/app/stores/reservas.store'
import { EstadoDeSolicitud } from '#eventos/shared/dominio/solicitud-de-evento'
import { useAgendaStore } from '#eventos/app/stores/agenda.store'
import PanelIndicador from '~/components/PanelIndicador.vue'
import { puedeVer } from '~/constants/secciones'

const sesion = useSesionStore()
const sincronizacion = useSincronizacionStore()
const inventario = useInventarioStore()
const estadoOperativo = useEstadoOperativoStore()
const reservas = useReservasStore()
const agenda = useAgendaStore()
const { claveDeDia, claveDeHoy } = useZonaHoraria()

function contar<T>(lista: T[], cumple: (elemento: T) => boolean): number {
  return lista.filter(cumple).length
}

const todosLosIndicadores = computed(() => [
  {
    etiqueta: 'Espacios libres ahora',
    valor: contar(estadoOperativo.espacios, e => e.estado === EstadoOperativo.LIBRE_AHORA),
    icono: 'i-lucide-door-open',
    destino: '/estado-operativo'
  },
  {
    etiqueta: 'Espacios ocupados',
    valor: contar(estadoOperativo.espacios, e => e.estado === EstadoOperativo.OCUPADO),
    icono: 'i-lucide-users',
    destino: '/estado-operativo'
  },
  {
    etiqueta: 'Reservas de hoy',
    valor: contar(reservas.reservas, r => r.estado === EstadoReserva.CONFIRMADA && claveDeDia(r.franja.inicio) === claveDeHoy()),
    icono: 'i-lucide-calendar-check',
    destino: '/reservas'
  },
  {
    etiqueta: 'Espacios habilitados',
    valor: contar(inventario.espacios, e => e.estado === EstadoEnInventario.HABILITADO),
    icono: 'i-lucide-armchair',
    destino: '/inventario'
  }
])

const todosLosPendientes = computed(() => [
  {
    etiqueta: 'En mantenimiento',
    valor: contar(estadoOperativo.espacios, e => e.estado === EstadoOperativo.EN_MANTENIMIENTO),
    icono: 'i-lucide-wrench',
    destino: '/estado-operativo'
  },
  {
    etiqueta: 'Reservas por reasignar',
    valor: contar(reservas.reservas, r => r.estado === EstadoReserva.POR_REASIGNAR),
    icono: 'i-lucide-calendar-x',
    destino: '/reservas'
  },
  {
    etiqueta: 'Eventos por aprobar',
    valor: contar(agenda.solicitudes, s => s.estado === EstadoDeSolicitud.PENDIENTE_DE_APROBACION),
    icono: 'i-lucide-presentation',
    destino: '/eventos'
  },
  {
    etiqueta: 'Espacios por habilitar',
    valor: contar(inventario.espacios, e => e.estado === EstadoEnInventario.REGISTRADO),
    icono: 'i-lucide-clipboard-check',
    destino: '/inventario'
  }
])

function soloVisibles<T extends { destino: string }>(indicadores: T[]): T[] {
  return indicadores.filter(indicador => puedeVer(sesion.rol, indicador.destino))
}

const indicadoresDelDia = computed(() => soloVisibles(todosLosIndicadores.value))
const pendientes = computed(() => soloVisibles(todosLosPendientes.value))

async function cargarPanel(): Promise<void> {
  await Promise.all([inventario.cargar(), estadoOperativo.cargar(), reservas.cargar(), agenda.cargar()])
}

watch(() => sincronizacion.version, cargarPanel)

onMounted(cargarPanel)
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-2xl font-semibold">Hoy</h1>
      <p class="mt-1 text-muted">Resumen de los espacios de Nodo</p>
    </div>
    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <PanelIndicador v-for="indicador in indicadoresDelDia" :key="indicador.etiqueta" v-bind="indicador" />
    </div>
    <div>
      <h2 class="mb-3 font-medium">Requiere atención</h2>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <PanelIndicador
          v-for="pendiente in pendientes"
          :key="pendiente.etiqueta"
          v-bind="pendiente"
          :is-destacado="pendiente.valor > 0"
        />
      </div>
    </div>
  </div>
</template>

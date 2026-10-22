<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { DatosDeEspacio } from '#inventario-espacios/shared/dominio/espacio'
import { NOMBRE_DE_TIPO } from '#inventario-espacios/shared/dominio/tipo-espacio'
import InventarioAforoEditor from '#inventario-espacios/app/components/InventarioAforoEditor.vue'
import InventarioTarjeta from '#inventario-espacios/app/components/InventarioTarjeta.vue'
import { PRESENTACION_DE_ESTADO, estaDadoDeBaja, sePuedeHabilitar, textoDeBuffer } from '#inventario-espacios/app/utils/presentacion.util'

interface InventarioTablaProps {
  espacios: DatosDeEspacio[]
}

interface InventarioTablaEmits {
  (event: 'habilitar', id: string): void
  (event: 'cambiarAforo', payload: { id: string, aforo: number }): void
  (event: 'darDeBaja', id: string): void
}

defineProps<InventarioTablaProps>()
const emit = defineEmits<InventarioTablaEmits>()

const columnas: TableColumn<DatosDeEspacio>[] = [
  { accessorKey: 'nombre', header: 'Espacio' },
  { accessorKey: 'tipo', header: 'Tipo' },
  { accessorKey: 'aforo', header: 'Aforo' },
  { accessorKey: 'bufferEnMinutos', header: 'Buffer' },
  { accessorKey: 'estado', header: 'Estado' },
  { id: 'acciones', header: '' }
]

function handleHabilitar(id: string): void {
  emit('habilitar', id)
}

function handleCambiarAforo(id: string, aforo: number): void {
  emit('cambiarAforo', { id, aforo })
}

function handleDarDeBaja(id: string): void {
  emit('darDeBaja', id)
}
</script>

<template>
  <ul class="space-y-2 md:hidden">
    <li v-for="espacio in espacios" :key="espacio.id">
      <InventarioTarjeta
        :espacio="espacio"
        @habilitar="handleHabilitar(espacio.id)"
        @cambiar-aforo="handleCambiarAforo(espacio.id, $event)"
        @dar-de-baja="handleDarDeBaja(espacio.id)"
      />
    </li>
  </ul>
  <UTable :data="espacios" :columns="columnas" class="hidden rounded-md border border-default bg-default md:block">
    <template #tipo-cell="{ row }">
      {{ NOMBRE_DE_TIPO[row.original.tipo] }}
    </template>
    <template #aforo-cell="{ row }">
      <InventarioAforoEditor
        :aforo="row.original.aforo"
        :is-disabled="estaDadoDeBaja(row.original)"
        @cambiar="handleCambiarAforo(row.original.id, $event)"
      />
    </template>
    <template #bufferEnMinutos-cell="{ row }">
      <span class="text-muted">{{ textoDeBuffer(row.original) }}</span>
    </template>
    <template #estado-cell="{ row }">
      <UBadge
        :label="PRESENTACION_DE_ESTADO[row.original.estado].etiqueta"
        :color="PRESENTACION_DE_ESTADO[row.original.estado].color"
        variant="subtle"
      />
    </template>
    <template #acciones-cell="{ row }">
      <div class="flex justify-end gap-1">
        <UButton
          v-if="sePuedeHabilitar(row.original)"
          label="Habilitar"
          size="xs"
          @click="handleHabilitar(row.original.id)"
        />
        <UButton
          v-if="!estaDadoDeBaja(row.original)"
          label="Dar de baja"
          color="neutral"
          variant="outline"
          size="xs"
          @click="handleDarDeBaja(row.original.id)"
        />
      </div>
    </template>
  </UTable>
</template>

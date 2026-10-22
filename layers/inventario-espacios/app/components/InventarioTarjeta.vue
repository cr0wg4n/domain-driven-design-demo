<script setup lang="ts">
import { computed } from 'vue'
import type { DatosDeEspacio } from '#inventario-espacios/shared/dominio/espacio'
import { NOMBRE_DE_TIPO } from '#inventario-espacios/shared/dominio/tipo-espacio'
import InventarioAforoEditor from '#inventario-espacios/app/components/InventarioAforoEditor.vue'
import { PRESENTACION_DE_ESTADO, estaDadoDeBaja, sePuedeHabilitar, textoDeBuffer } from '#inventario-espacios/app/utils/presentacion.util'

interface InventarioTarjetaProps {
  espacio: DatosDeEspacio
}

interface InventarioTarjetaEmits {
  (event: 'habilitar'): void
  (event: 'cambiarAforo', aforo: number): void
  (event: 'darDeBaja'): void
}

const props = defineProps<InventarioTarjetaProps>()
const emit = defineEmits<InventarioTarjetaEmits>()

const presentacion = computed(() => PRESENTACION_DE_ESTADO[props.espacio.estado])
const detalle = computed(() => `${NOMBRE_DE_TIPO[props.espacio.tipo]}, ${textoDeBuffer(props.espacio).toLowerCase()}`)

function handleHabilitar(): void {
  emit('habilitar')
}

function handleCambiarAforo(aforo: number): void {
  emit('cambiarAforo', aforo)
}

function handleDarDeBaja(): void {
  emit('darDeBaja')
}
</script>

<template>
  <div class="flex flex-col gap-3 rounded-md border border-default bg-default p-3">
    <div class="flex items-start justify-between gap-2">
      <div class="min-w-0">
        <p class="font-medium">{{ espacio.nombre }}</p>
        <p class="text-sm text-muted">{{ detalle }}</p>
      </div>
      <UBadge :label="presentacion.etiqueta" :color="presentacion.color" variant="subtle" size="sm" />
    </div>
    <div class="flex flex-wrap items-center gap-2">
      <span class="text-sm text-muted">Aforo</span>
      <InventarioAforoEditor
        :aforo="espacio.aforo"
        :is-disabled="estaDadoDeBaja(espacio)"
        @cambiar="handleCambiarAforo"
      />
      <div class="ml-auto flex gap-1">
        <UButton v-if="sePuedeHabilitar(espacio)" label="Habilitar" size="xs" @click="handleHabilitar" />
        <UButton
          v-if="!estaDadoDeBaja(espacio)"
          label="Dar de baja"
          color="neutral"
          variant="outline"
          size="xs"
          @click="handleDarDeBaja"
        />
      </div>
    </div>
  </div>
</template>

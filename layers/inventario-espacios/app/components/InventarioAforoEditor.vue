<script setup lang="ts">
import { ref } from 'vue'

interface InventarioAforoEditorProps {
  aforo: number
  isDisabled?: boolean
}

interface InventarioAforoEditorEmits {
  (event: 'cambiar', aforo: number): void
}

const props = defineProps<InventarioAforoEditorProps>()
const emit = defineEmits<InventarioAforoEditorEmits>()

const estaAbierto = ref(false)
const aforoNuevo = ref(props.aforo)

function handleAbrir(abierto: boolean): void {
  estaAbierto.value = abierto
  if (abierto) aforoNuevo.value = props.aforo
}

function handleGuardar(): void {
  emit('cambiar', aforoNuevo.value)
  estaAbierto.value = false
}
</script>

<template>
  <UPopover :open="estaAbierto" @update:open="handleAbrir">
    <UButton
      :label="String(aforo)"
      trailing-icon="i-lucide-pencil"
      color="neutral"
      variant="outline"
      size="xs"
      :disabled="isDisabled"
    />
    <template #content>
      <form class="flex items-end gap-2 p-3" @submit.prevent="handleGuardar">
        <UFormField label="Aforo nuevo">
          <UInputNumber v-model="aforoNuevo" :min="1" class="w-28" />
        </UFormField>
        <UButton type="submit" label="Cambiar" size="sm" />
      </form>
    </template>
  </UPopover>
</template>

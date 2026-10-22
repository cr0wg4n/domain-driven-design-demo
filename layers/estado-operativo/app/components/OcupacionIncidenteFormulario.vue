<script setup lang="ts">
import { ref } from 'vue'

interface OcupacionIncidenteFormularioEmits {
  (event: 'registrar', descripcion: string): void
}

const emit = defineEmits<OcupacionIncidenteFormularioEmits>()

const estaAbierto = ref(false)
const descripcion = ref('')

function handleRegistrar(): void {
  emit('registrar', descripcion.value)
  estaAbierto.value = false
  descripcion.value = ''
}
</script>

<template>
  <UPopover v-model:open="estaAbierto">
    <UButton label="Incidente" icon="i-lucide-triangle-alert" color="neutral" variant="outline" size="xs" />
    <template #content>
      <form class="w-64 space-y-2 p-3" @submit.prevent="handleRegistrar">
        <UFormField label="¿Qué falla?">
          <UTextarea v-model="descripcion" :rows="2" placeholder="Se rompió el aire acondicionado" class="w-full" />
        </UFormField>
        <UButton type="submit" label="Registrar incidente" size="sm" block />
      </form>
    </template>
  </UPopover>
</template>

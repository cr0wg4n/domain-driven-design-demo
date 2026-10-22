<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from '#imports'
import RolSelector from '#compartido/app/components/RolSelector.vue'
import type { Seccion } from '~/constants/secciones'

interface MenuMovilProps {
  secciones: Seccion[]
}

interface MenuMovilEmits {
  (event: 'restablecer'): void
}

defineProps<MenuMovilProps>()
const emit = defineEmits<MenuMovilEmits>()

const route = useRoute()
const estaAbierto = ref(false)

function handleRestablecer(): void {
  emit('restablecer')
  estaAbierto.value = false
}

watch(() => route.path, () => {
  estaAbierto.value = false
})
</script>

<template>
  <USlideover v-model:open="estaAbierto" side="left" title="Nodo" description="Espacios y recursos">
    <UButton icon="i-lucide-menu" color="neutral" variant="outline" size="sm" aria-label="Abrir menú" />
    <template #body>
      <div class="flex h-full flex-col gap-6">
        <UNavigationMenu :items="secciones" orientation="vertical" />
        <div class="mt-auto space-y-3">
          <RolSelector class="w-full" />
          <UButton
            label="Restablecer datos de prueba"
            icon="i-lucide-rotate-ccw"
            color="neutral"
            variant="outline"
            block
            @click="handleRestablecer"
          />
        </div>
      </div>
    </template>
  </USlideover>
</template>

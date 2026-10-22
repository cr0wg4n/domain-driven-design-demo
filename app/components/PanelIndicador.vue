<script setup lang="ts">
interface PanelIndicadorProps {
  etiqueta: string
  valor: number
  icono: string
  destino: string
  isDestacado?: boolean
}

defineProps<PanelIndicadorProps>()
</script>

<template>
  <NuxtLink
    :to="destino"
    class="flex items-center gap-4 rounded-md border bg-default p-4 transition-colors hover:bg-elevated"
    :class="isDestacado ? 'border-warning/50' : 'border-default'"
  >
    <UIcon :name="icono" class="size-6 shrink-0" :class="isDestacado ? 'text-warning' : 'text-primary-500'" />
    <div>
      <p class="text-2xl font-semibold tabular-nums">{{ valor }}</p>
      <p class="text-sm text-muted">{{ etiqueta }}</p>
    </div>
  </NuxtLink>
</template>

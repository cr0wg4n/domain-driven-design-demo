const RUTA_DE_REINICIO = '/api/demo/reiniciar'

async function restablecerDatosDePrueba(): Promise<void> {
  await $fetch(RUTA_DE_REINICIO, { method: 'POST' })
}

export { restablecerDatosDePrueba }

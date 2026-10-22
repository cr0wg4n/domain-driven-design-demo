import { defineNitroPlugin } from 'nitropack/runtime'
import { alReiniciar, alSembrar } from '#compartido/server/utils/demo'
import { sembrarInventario, vaciarInventario } from '#inventario-espacios/server/utils/inventario'

export default defineNitroPlugin(() => {
  alReiniciar(vaciarInventario)
  alSembrar(1, sembrarInventario)
})

type Resultado<T> =
  | { readonly esExitoso: true, readonly valor: T }
  | { readonly esExitoso: false, readonly motivo: string }

function exito<T>(valor: T): Resultado<T> {
  return { esExitoso: true, valor }
}

function rechazo<T = never>(motivo: string): Resultado<T> {
  return { esExitoso: false, motivo }
}

export { exito, rechazo }
export type { Resultado }

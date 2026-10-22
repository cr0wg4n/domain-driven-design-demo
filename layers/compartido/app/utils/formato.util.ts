function oracionDesde(nombreDeEvento: string): string {
  const palabras = nombreDeEvento.split(/(?=[A-Z])/).map(palabra => palabra.toLowerCase())
  const oracion = palabras.join(' ')
  return oracion.charAt(0).toUpperCase() + oracion.slice(1)
}

export { oracionDesde }

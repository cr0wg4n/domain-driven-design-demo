enum Rol {
  DIRECCION = 'DIRECCION',
  OPERACIONES = 'OPERACIONES',
  RECEPCION = 'RECEPCION',
  MIEMBRO = 'MIEMBRO'
}

const NOMBRE_DE_ROL: Record<Rol, string> = {
  [Rol.DIRECCION]: 'Dirección',
  [Rol.OPERACIONES]: 'Operaciones',
  [Rol.RECEPCION]: 'Recepción',
  [Rol.MIEMBRO]: 'Miembro'
}

function esRol(valor: unknown): valor is Rol {
  return Object.values(Rol).includes(valor as Rol)
}

export { Rol, NOMBRE_DE_ROL, esRol }

export interface CondominiumMembership {
    condominiumId: number,
    address: AddressInfo,
    role: string
}

const ROLE_DESCRIPTIONS = {
  Syndic: 'Síndico',
  CondominiumAdministrator: 'Administrador de Condomínio',
  SubSyndic: 'Subsíndico',
  FiscalCouncil: 'Conselho Fiscal',
  Doorman: 'Porteiro',
  Resident: 'Morador',
  Dependent: 'Dependente',
} as const;

export const getUserRoleDescription = (role: string) => {
    return ROLE_DESCRIPTIONS[role as keyof typeof ROLE_DESCRIPTIONS] ?? role;
}

export interface AddressInfo {
    condominiumName: string,
    stateCode: string,
    city: string,
    neighborhood: string,
    street: string,
    number: string,
    postalCode: string,
}
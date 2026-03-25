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


const ROLE_SEVERITIES = {
  Syndic: 'success',
  CondominiumAdministrator: 'success',
  SubSyndic: 'warning',
  FiscalCouncil: 'warning',
  Doorman: 'contrast',
  Resident: 'contrast',
  Dependent: 'contrast',
} as const;

export const getUserRoleDescription = (role: string) => {
    return ROLE_DESCRIPTIONS[role as keyof typeof ROLE_DESCRIPTIONS] ?? role;
}

export const getUserRoleSeverity = (role: string) => {
    return ROLE_SEVERITIES[role as keyof typeof ROLE_SEVERITIES] ?? "contrast";
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

export const getAddressLine = (addressInfo: AddressInfo) => {
    return `${addressInfo.city} - ${addressInfo.stateCode}, ${addressInfo.neighborhood}, CEP: ${postalCodeFormatted(addressInfo.postalCode)}, ${addressInfo.street}, n° ${addressInfo.number}`
}

const postalCodeFormatted = (postalCode: string) => {
    const firstPart = postalCode.substring(0, 5)
    const secondPart = postalCode.substring(6, 9)
    return `${firstPart}-${secondPart}`
}
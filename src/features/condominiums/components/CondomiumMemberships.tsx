import { Tag } from "primereact/tag"
import { Paginator } from 'primereact/paginator'
import type { PaginatorPageChangeEvent } from 'primereact/paginator'
import { useEffect, useRef, useState } from 'react'
import { Button } from "primereact/button"
import { useNavigate } from "@tanstack/react-router"
import { getCondominiumMemberships } from "@/features/users/services/condominiumMembershipService"
import { getAddressLine, getUserRoleDescription, getUserRoleSeverity, type AddressInfo, type CondominiumMembership } from "@/features/users/types/CondominiumMembership"
import { Card } from "primereact/card"
import { Divider } from "primereact/divider"

export const CondominiumMemberships = () => {
    const [first, setFirst] = useState<number>(0)
    const [memberships, setMemberships] = useState<CondominiumMembership[]>([])
    const itemsPerPage = 3
    const navigator = useNavigate();
    const hasPaginatedRef = useRef(false)

    const onPageChange = (event: PaginatorPageChangeEvent) => {
        setFirst(event.first)
        hasPaginatedRef.current = true
    }

    const pageItems = memberships.slice(first, first + itemsPerPage)

    const noMembershipsText = (
        <div className="mx-auto mt-6 w-full rounded-2xl border border-gray-200 bg-gray-50/60 px-6 py-8 text-center sm:max-w-xl">
            <p className="text-sm font-medium text-gray-500 sm:text-base">Você ainda não possui condomínios vinculados.</p>
        </div>
    )

    useEffect(() => {
        (
            async () => {
                setMemberships(await getCondominiumMemberships())
            }
        )()
    }, [navigator])

    useEffect(() => {
        if (!hasPaginatedRef.current) return

        requestAnimationFrame(() => {
            const scrollRoot = document.scrollingElement ?? document.documentElement
            scrollRoot.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        })
    }, [first])
    
    const getFooter = (role: string) => (
        <>
            <Divider type="solid" className="my-4! border-gray-100!"/>
            <div className="flex flex-row justify-between items-center">
                <Tag
                    value={getUserRoleDescription(role)}
                    severity={getUserRoleSeverity(role)}
                />
                <Button label="Acessar" text icon='pi pi-arrow-right' iconPos="right" className="!px-0 text-emerald-700 hover:text-emerald-800 font-semibold"/>
            </div>
        </>
    )

    const photoUrl = (
        <img className="m-0 h-44 w-full rounded-t-2xl object-cover p-0" src='https://static.arboimoveis.com.br/AP0247_FSIM/640x480/189e36cb-9313-4e49-a79e-df19b89c8b1e1689703837460.jpg' alt="" />
    )

    const getSubtitle = (addressInfo: AddressInfo) => (
        <div className="flex items-start gap-2 text-sm text-gray-500">
            <i className="pi pi-map-marker mt-[0.1rem] text-emerald-700"></i>
            <p className="m-0 leading-5">{getAddressLine(addressInfo)}</p>
        </div>
    )

    const membershipsList = (
        <div className="w-full flex flex-wrap gap-4 sm:gap-6">
            {pageItems.map(condominium => (
                <Card className="w-full lg:w-[calc((100%-3rem)/3)] rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-100 hover:-translate-y-0.5 hover:shadow-md"
                    header={photoUrl}
                    title={condominium.address.condominiumName}
                    subTitle={getSubtitle(condominium.address)}
                    footer={getFooter(condominium.role)}/>
            ))}
            
        </div>
    )

    return (
        <>
            <div className='w-full flex flex-col justify-center items-center py-2 sm:py-4'>
                <div className="w-full flex flex-col justify-center items-center">
                    {memberships.length === 0 ? noMembershipsText : membershipsList}
                    <Paginator
                        className="mt-8 rounded-xl border border-gray-100 bg-white px-1 py-1 shadow-sm"
                        first={first}
                        rows={itemsPerPage}
                        totalRecords={memberships.length}
                        onPageChange={onPageChange} 
                    />
                </div>
                <div className="mt-8 w-full max-w-2xl rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-4 sm:px-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                            <p className="m-0 text-sm font-semibold text-emerald-900">Não encontrou seu condomínio?</p>
                            <p className="m-0 mt-1 text-sm text-emerald-800/80">Solicite acesso para se vincular e aguarde aprovação.</p>
                        </div>
                        <Button
                            label="Solicitar acesso"
                            icon="pi pi-send"
                            iconPos="right"
                            rounded
                            className="w-full sm:w-auto bg-emerald-600 border-emerald-600 hover:bg-emerald-700 hover:border-emerald-700 text-white font-semibold px-4"
                        />
                    </div>
                </div>
            </div>
        </>
    )

}

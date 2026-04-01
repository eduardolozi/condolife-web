import { Tag } from "primereact/tag"
import { Paginator } from 'primereact/paginator'
import type { PaginatorPageChangeEvent } from 'primereact/paginator'
import { useEffect, useRef, useState } from 'react'
import { Button } from "primereact/button"
import { Link } from "@tanstack/react-router"
import { getAddressLine, getUserRoleDescription, getUserRoleSeverity, type AddressInfo, type CondominiumMembership } from "@/features/users/types/CondominiumMembership"
import { Card } from "primereact/card"
import { Divider } from "primereact/divider"

export interface CondominiumMembershipsProps {
    memberships: CondominiumMembership[]
}

export const CondominiumMemberships = ({memberships}: CondominiumMembershipsProps) => {
    const [first, setFirst] = useState<number>(0)
    const itemsPerPage = 3
    const hasPaginatedRef = useRef(false)
    const topAnchorRef = useRef<HTMLDivElement | null>(null)

    const onPageChange = (event: PaginatorPageChangeEvent) => {
        setFirst(event.first)
        hasPaginatedRef.current = true
    }

    const pageItems = memberships.slice(first, first + itemsPerPage)

    useEffect(() => {
        if (!hasPaginatedRef.current) return

        requestAnimationFrame(() => {
            if (topAnchorRef.current) {
                topAnchorRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                })
                return
            }

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        })
    }, [first])

    const getFooter = (role: string) => (
        <>
            <Divider type="solid" className="mt-0 mb-2 border-gray-100!"/>
            <div className="flex flex-row items-center justify-center sm:justify-end">
                <Tag
                    className="w-full py-1 text-xs sm:w-1/3"
                    value={getUserRoleDescription(role)}
                    severity={getUserRoleSeverity(role)}
                />
            </div>
        </>
    )

    const photoUrl = (
        <img className="m-0 h-32 w-full rounded-t-2xl object-cover p-0 sm:h-36" src='https://static.arboimoveis.com.br/AP0247_FSIM/640x480/189e36cb-9313-4e49-a79e-df19b89c8b1e1689703837460.jpg' alt="Fachada do condomínio" />
    )

    const getSubtitle = (addressInfo: AddressInfo) => (
        <div className="flex items-start gap-2 text-sm text-gray-500">
            <i className="pi pi-map-marker mt-[0.1rem] text-emerald-700"></i>
            <p className="m-0 leading-5">{getAddressLine(addressInfo)}</p>
        </div>
    )

    const actionCard = (link: string, icon: string, title: string, description: string) => {
        return (
            <Link
            to={link}
            preload="intent"
            className="no-underline hover:cursor-pointer flex min-h-56 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/45 px-6 py-6 text-center transition-all duration-150 hover:border-emerald-300 hover:bg-emerald-50"
            >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
                <i className={`pi ${icon} text-2xl`} />
            </div>
            <p className="m-0 text-xl font-semibold text-emerald-950">{title}</p>
            <p className="m-0 mt-1.5 max-w-[18rem] text-sm leading-6 text-emerald-900/80">
                {description}
            </p>
            </Link>
        )
    }

    const membershipsList = (
        <div className="mt-2 grid w-full grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
            {pageItems.map((condominium) => (
                <Link
                    key={condominium.condominiumId}
                    to="/condominiums/$condominiumId"
                    params={{ condominiumId: String(condominium.condominiumId) }}
                    preload="intent"
                    className="block no-underline"
                >
                    <Card
                        className="condominium-membership-card h-full w-full cursor-pointer rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-100 hover:-translate-y-0.5 hover:shadow-md"
                        header={photoUrl}
                        title={condominium.address.condominiumName}
                        subTitle={getSubtitle(condominium.address)}
                        footer={getFooter(condominium.role)}
                    />
                </Link>
            ))}

            {actionCard("/condominiums/create", "pi-plus", "Novo condomínio", "Adicione uma nova propriedade para começar a gerenciar.")}
            {actionCard("/condominiums/create", "pi-send", "Não encontrou seu condomínio?", "Solicite acesso para se vincular e aguarde aprovação.")}
        </div>
    )

    return (
        <>
            <div className='flex w-full flex-col items-center justify-center py-2 sm:py-4'>
                <div ref={topAnchorRef} />
                <div className="flex w-full flex-col items-center justify-center">
                    {membershipsList}

                    {memberships.length > itemsPerPage && (
                        <Paginator
                            className="mt-8 rounded-xl border border-gray-100 bg-white px-1 py-1 shadow-sm"
                            first={first}
                            rows={itemsPerPage}
                            totalRecords={memberships.length}
                            onPageChange={onPageChange}
                        />
                    )}
                </div>
            </div>
        </>
    )
}

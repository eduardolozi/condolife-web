import { Tag } from "primereact/tag"
import { condominiums } from "../types/Condominium"
import { Paginator } from 'primereact/paginator'
import type { PaginatorPageChangeEvent } from 'primereact/paginator'
import { useState } from 'react'

export const CondominiumMemberships = () => {
    const [first, setFirst] = useState<number>(0)
    const rows = 5

    const onPageChange = (event: PaginatorPageChangeEvent) => {
        setFirst(event.first)
    }

    const pageItems = condominiums.slice(first, first + rows)
    const fillers = Math.max(0, rows - pageItems.length)
    
    return (
        <div className='flex w-full flex-col gap-2'>
            <div className="flex min-h-72 flex-col gap-2 sm:min-h-88 lg:min-h-104">
                {pageItems.map(x => (
                    <div
                        key={`${x.name}-${x.address.number}`}
                        className="flex cursor-pointer flex-col items-start gap-3 rounded-xl border border-gray-200 bg-white p-3 sm:flex-row sm:items-center"
                    >
                        <img
                            className="h-12 w-12 shrink-0 rounded-lg object-cover sm:h-14 sm:w-14"
                            src="https://static.arboimoveis.com.br/AP0247_FSIM/640x480/189e36cb-9313-4e49-a79e-df19b89c8b1e1689703837460.jpg"
                            alt="Foto condominio"
                        />

                        <div className="min-w-0 flex-1 flex flex-col gap-1">
                            <span className="max-w-full truncate font-bold">{x.name}</span>

                            <div className="flex min-w-0 items-center gap-2">
                                <i className="pi pi-map-marker text-sm"></i>
                                <span className="wrap-break-word text-sm text-zinc-600 sm:truncate">
                                    {x.address.city}, {x.address.state} - {x.address.neighborhood}, {x.address.street}, {x.address.number}
                                </span>
                            </div>
                        </div>

                        <Tag
                            value="Síndico"
                            severity="success"
                            className="self-end px-2 py-1 text-xs sm:self-auto sm:ml-2"
                        />
                    </div>
                ))}

                {Array.from({ length: fillers }).map((_, index) => (
                    <div
                        key={`filler-${index}`}
                        className="invisible flex flex-col items-start gap-3 rounded-xl border border-gray-200 bg-white p-3 sm:flex-row sm:items-center"
                    >
                        <div className="h-12 w-12 shrink-0 rounded-lg sm:h-14 sm:w-14" />
                        <div className="flex-1" />
                        <div className="h-6 w-16" />
                    </div>
                ))}
            </div>

            <Paginator
                className="condo-memberships-paginator mt-1"
                first={first}
                rows={rows}
                totalRecords={condominiums.length}
                onPageChange={onPageChange}
            />
        </div>
    )

}

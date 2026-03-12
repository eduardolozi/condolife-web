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

    return (
        <div className='flex w-full max-w-150 flex-col gap-2'>
            <div className="flex max-h-112 min-h-112 flex-col gap-2">
                {pageItems.map(x => (
                    <div key={`${x.name}-${x.address.number}`} className="hover:cursor-pointer flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3">
                        <img
                            className="h-14 w-14 shrink-0 rounded-lg object-cover"
                            src="https://static.arboimoveis.com.br/AP0247_FSIM/640x480/189e36cb-9313-4e49-a79e-df19b89c8b1e1689703837460.jpg"
                            alt="Foto condominio" />

                        <div className="flex-1 min-w-0 flex flex-col gap-1">
                            <span className="font-bold">{x.name}</span>
                            <div className="flex items-center gap-2 min-w-0">
                                <i className="pi pi-map-marker text-sm"></i>
                                <span className="truncate text-sm text-zinc-600">{x.address.city}, {x.address.state} - {x.address.neighborhood}, {x.address.street}, {x.address.number}</span>
                            </div>
                        </div>

                        <Tag value="Síndico" severity="success" className="px-2 py-1 text-xs" />
                    </div>
                ))}
            </div>
            <Paginator first={first} rows={rows} totalRecords={condominiums.length} onPageChange={onPageChange}/>
        </div>
    )
          
}

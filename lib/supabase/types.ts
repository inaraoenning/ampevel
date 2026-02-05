export type PhotoSlot =
    | 'front'
    | 'rear'
    | 'left'
    | 'right'
    | 'engine'
    | 'interior_driver'
    | 'interior_passenger'
    | 'trunk'

export interface CarImage {
    url: string
    slot?: PhotoSlot | null
    order?: number
    isPrimary?: boolean
    uploadedAt?: string
}

export interface Car {
    id: string
    title: string
    price: number
    year: number
    km: number
    transmission: string
    fuel: string
    description: string | null
    images: CarImage[]
    created_at: string
    updated_at: string
}

export interface CarInsert {
    title: string
    price: number
    year: number
    km: number
    transmission: string
    fuel: string
    description?: string
    images: CarImage[]
}
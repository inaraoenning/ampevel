'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { CarInsert } from '../supabase/types'
export async function getCars() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('car-images')
        .select('*')
        .order('created_at', { ascending: false })
    if (error) throw error
    return data
}
export async function getCarById(id: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('car-images')
        .select('*')
        .eq('id', id)
        .single()
    if (error) throw error
    return data
}
export async function createCar(car: CarInsert) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('car-images')
        .insert(car)
        .select()
        .single()
    if (error) throw error

    revalidatePath('/admin/dashboard')
    return data
}
export async function updateCar(id: string, updates: Partial<CarInsert>) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('car-images')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
    if (error) throw error

    revalidatePath('/admin/dashboard')
    return data
}
export async function deleteCar(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('car-images')
        .delete()
        .eq('id', id)
    if (error) throw error

    revalidatePath('/admin/dashboard')
}
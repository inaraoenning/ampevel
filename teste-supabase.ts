// test-supabase.ts (na raiz do projeto)
import { createClient } from '@/utils/supabase/server'

async function testConnection() {
    try {
        const supabase = await createClient()
        const { data, error } = await supabase.auth.getUser()

        if (error) {
            console.error('Erro na autenticação:', error.message)
        } else {
            console.log('✅ Supabase conectado! Usuário:', data?.user?.email || 'Não autenticado')
        }
    } catch (err) {
        console.error('❌ Erro na conexão:', err)
    }
}

testConnection()
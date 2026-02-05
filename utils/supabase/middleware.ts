import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export const updateSession = async (request: NextRequest) => {
    try {
        // Se variáveis de ambiente não estiverem configuradas, passa adiante
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!url || !key || !url.startsWith('http')) {
            console.warn('Supabase URL or Key missing or invalid')
            return NextResponse.next({
                request,
            })
        }

        // Log only lengths to avoid exposing secrets in logs — helps debug env availability
        try {
            console.info('Supabase env presence:', {
                urlLength: url?.length ?? 0,
                keyLength: key?.length ?? 0,
            })
        } catch (e) {
            // ignore logging errors
        }

        let supabaseResponse = NextResponse.next({
            request,
        })

        const supabase = createServerClient(
            url,
            key,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value }) =>
                            request.cookies.set(name, value)
                        )
                        supabaseResponse = NextResponse.next({
                            request,
                        })
                        cookiesToSet.forEach(({ name, value, options }) =>
                            supabaseResponse.cookies.set(name, value, options)
                        )
                    },
                },
            }
        )

        // Importante: isso irá atualizar os cookies no request
        const {
            data: { user },
        } = await supabase.auth.getUser()

        // Redirecionar para login se tentar acessar área admin sem autenticação
        if (request.nextUrl.pathname.startsWith('/admin') &&
            !request.nextUrl.pathname.startsWith('/admin/login') &&
            !user) {
            const url = request.nextUrl.clone()
            url.pathname = '/admin/login'
            return NextResponse.redirect(url)
        }

        return supabaseResponse
    } catch (error) {
        // Se algo der errado no middleware, apenas passa adiante
        console.error('Middleware error:', error)
        return NextResponse.next({
            request,
        })
    }
}

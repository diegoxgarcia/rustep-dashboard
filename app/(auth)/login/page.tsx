import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { signInWithGoogle } from '@/lib/actions'

export default async function LoginPage() {
  const session = await auth()
  if (session) redirect('/')

  return (
    <div className="min-h-screen bg-[#071A2F] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decoracion geometrica - esquina superior izquierda */}
      <div className="absolute top-0 left-0 w-48 h-48 pointer-events-none">
        <div className="absolute top-0 left-0 w-32 h-0.5 bg-gradient-to-r from-[#FF5A1F] to-transparent" />
        <div className="absolute top-0 left-0 w-0.5 h-32 bg-gradient-to-b from-[#FF5A1F] to-transparent" />
        <div className="absolute top-8 left-8 w-16 h-0.5 bg-gradient-to-r from-[#00C2FF]/40 to-transparent" />
        <div className="absolute top-8 left-8 w-0.5 h-16 bg-gradient-to-b from-[#00C2FF]/40 to-transparent" />
      </div>

      {/* Decoracion geometrica - esquina inferior derecha */}
      <div className="absolute bottom-0 right-0 w-48 h-48 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-32 h-0.5 bg-gradient-to-l from-[#FF5A1F] to-transparent" />
        <div className="absolute bottom-0 right-0 w-0.5 h-32 bg-gradient-to-t from-[#FF5A1F] to-transparent" />
        <div className="absolute bottom-8 right-8 w-16 h-0.5 bg-gradient-to-l from-[#00C2FF]/40 to-transparent" />
        <div className="absolute bottom-8 right-8 w-0.5 h-16 bg-gradient-to-t from-[#00C2FF]/40 to-transparent" />
      </div>

      {/* Glow ambiental */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF5A1F]/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Card principal */}
        <div className="bg-[#0D2540] border border-[#1A3A5C] rounded-2xl shadow-2xl p-10 space-y-8">

          {/* Logo y branding */}
          <div className="text-center space-y-3">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="h-20 w-20 bg-[#FF5A1F]/15 border border-[#FF5A1F]/40 rounded-2xl flex items-center justify-center">
                  <span className="font-bebas text-[#FF5A1F] text-4xl tracking-wider leading-none">R</span>
                </div>
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-[#00C2FF] rounded-full" />
              </div>
            </div>
            <h1 className="font-bebas text-[#FF5A1F] text-6xl tracking-widest leading-none">
              RUSTEP
            </h1>
            <p className="font-rajdhani text-[#00C2FF] text-sm tracking-widest uppercase font-semibold">
              Dashboard Admin
            </p>
            <p className="font-exo text-white text-sm tracking-wide">
              CAMINÁ. CORRÉ. COMPETÍ.
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#1A3A5C]" />
            <span className="text-[#8BA4BE] text-xs font-rajdhani tracking-widest uppercase">Acceder</span>
            <div className="flex-1 h-px bg-[#1A3A5C]" />
          </div>

          {/* Boton Google */}
          <div className="space-y-4">
            <p className="text-center text-sm text-[#8BA4BE] font-exo">
              Inicia sesion con tu cuenta de Google para acceder al dashboard
            </p>
            <form action={signInWithGoogle}>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-medium py-3.5 px-4 rounded-lg hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F] focus:ring-offset-2 focus:ring-offset-[#0D2540] font-exo shadow-lg"
              >
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continuar con Google
              </button>
            </form>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-[#8BA4BE] font-exo">
            Solo accesible para administradores autorizados
          </p>
        </div>
      </div>
    </div>
  )
}

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { signInWithGoogle } from '@/lib/actions'

export default async function LoginPage() {
  const session = await auth()
  if (session) redirect('/')

  return (
    <div className="min-h-screen bg-[#0A0A12] flex relative overflow-hidden">

      {/* LEFT PANEL — branding con asset */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center p-12 overflow-hidden">
        {/* Asset de fondo — logo-wide con efecto atmosférico */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/logo-wide.svg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ opacity: 0.22 }}
        />
        {/* Gradient overlay — transparente en el centro, oscuro en los bordes */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, #0A0A1233 0%, #0A0A1299 60%, #0A0A12 100%)',
          }}
        />
        {/* Right vignette para fundir con el panel de login */}
        <div
          className="absolute inset-y-0 right-0 w-32"
          style={{ background: 'linear-gradient(to right, transparent, #0A0A12)' }}
        />
        {/* Logo grande centrado */}
        <div className="relative z-10 text-center space-y-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/logo.svg"
            alt="Rustep"
            className="w-48 h-48 mx-auto drop-shadow-2xl"
            style={{ filter: 'drop-shadow(0 0 32px #FF5A1F66)' }}
          />
          <h1 className="font-bebas text-[#FF5A1F] text-7xl tracking-widest leading-none drop-shadow-lg">
            RUSTEP
          </h1>
          <p className="font-rajdhani text-[#00C2FF] text-base tracking-[0.4em] uppercase font-semibold">
            Energía en cada paso
          </p>
        </div>
      </div>

      {/* RIGHT PANEL — login card */}
      <div className="flex-1 lg:max-w-md flex items-center justify-center p-6 lg:p-12 relative z-10">
        {/* Corner decorations */}
        <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none">
          <div className="absolute top-0 right-0 w-20 h-0.5 bg-gradient-to-l from-[#FF5A1F] to-transparent" />
          <div className="absolute top-0 right-0 w-0.5 h-20 bg-gradient-to-b from-[#FF5A1F] to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 w-32 h-32 pointer-events-none">
          <div className="absolute bottom-0 left-0 w-20 h-0.5 bg-gradient-to-r from-[#00C2FF]/50 to-transparent" />
          <div className="absolute bottom-0 left-0 w-0.5 h-20 bg-gradient-to-t from-[#00C2FF]/50 to-transparent" />
        </div>

        <div className="w-full max-w-sm space-y-8">

          {/* Mobile logo (solo visible en mobile) */}
          <div className="lg:hidden text-center space-y-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo.svg" alt="Rustep" className="w-24 h-24 mx-auto" />
            <h1 className="font-bebas text-[#FF5A1F] text-5xl tracking-widest">RUSTEP</h1>
            <p className="font-rajdhani text-[#00C2FF] text-xs tracking-widest uppercase">Dashboard Admin</p>
          </div>

          {/* Card */}
          <div className="bg-[#12121E] border border-[#1E1E30] rounded-2xl shadow-2xl p-8 space-y-7">

            {/* Heading */}
            <div className="space-y-1">
              <h2 className="font-bebas text-white text-3xl tracking-widest">ACCESO ADMIN</h2>
              <p className="font-exo text-[#8BA4BE] text-sm">
                Inicia sesión con tu cuenta de Google autorizada
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#1E1E30]" />
              <span className="text-[#8BA4BE] text-xs font-rajdhani tracking-widest uppercase">Google OAuth</span>
              <div className="flex-1 h-px bg-[#1E1E30]" />
            </div>

            {/* Boton Google */}
            <form action={signInWithGoogle}>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-medium py-3.5 px-4 rounded-lg hover:bg-gray-50 active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F] focus:ring-offset-2 focus:ring-offset-[#12121E] font-exo shadow-lg"
              >
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continuar con Google
              </button>
            </form>

            {/* Footer aviso */}
            <p className="text-center text-xs text-[#8BA4BE]/70 font-exo leading-relaxed">
              Solo accesible para administradores autorizados.
              <br />
              El acceso queda registrado.
            </p>
          </div>

          {/* Version tag */}
          <p className="text-center text-[#1E1E30] text-xs font-mono">Rustep Dashboard · Fase 1</p>
        </div>
      </div>
    </div>
  )
}

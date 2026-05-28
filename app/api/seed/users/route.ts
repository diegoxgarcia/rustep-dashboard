import { NextRequest, NextResponse } from 'next/server'
import { auth, isAdmin } from '@/lib/auth'
import connectToMongoDB from '@/lib/mongodb'
import User from '@/lib/models/user.model'

const firstNames = [
  'Santiago', 'Valentina', 'Mateo', 'Isabella', 'Sebastián', 'Camila', 'Nicolás',
  'Sofía', 'Alejandro', 'Daniela', 'Diego', 'Lucía', 'Andrés', 'Gabriela', 'Felipe',
  'Mariana', 'Emilio', 'Paula', 'Ricardo', 'Carolina', 'Lucas', 'Andrea', 'Javier',
  'Ana', 'Pablo', 'Laura', 'Carlos', 'María', 'Tomás', 'Valeria',
]

const lastNames = [
  'García', 'Martínez', 'López', 'González', 'Rodríguez', 'Fernández', 'Pérez',
  'Sánchez', 'Ramírez', 'Torres', 'Flores', 'Díaz', 'Morales', 'Jiménez', 'Reyes',
  'Muñoz', 'Alvarado', 'Castillo', 'Herrera', 'Vargas',
]

const cities = ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'Tucumán', 'Mar del Plata', 'Bogotá', 'Ciudad de México', 'Lima', 'Santiago']
const countries = ['Argentina', 'Colombia', 'México', 'Perú', 'Chile']
const categories = ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active']

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
  }

  await connectToMongoDB()

  const body = await request.json()
  const count = Math.min(Math.max(parseInt(body.count || '10', 10), 1), 100)
  const activityCategory = body.activityCategory || null

  const created = []

  for (let i = 0; i < count; i++) {
    const firstName = randomItem(firstNames)
    const lastName = randomItem(lastNames)
    const displayName = `${firstName} ${lastName}`
    const ts = Date.now()
    const email = `user_${ts}_${i}@test.com`
    const googleId = `test_google_${ts}_${i}`

    const user = await User.create({
      googleId,
      email,
      displayName,
      photoUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      age: Math.floor(Math.random() * 40) + 18,
      gender: randomItem(['male', 'female', 'other']),
      city: randomItem(cities),
      country: randomItem(countries),
      activityCategory: activityCategory || randomItem(categories),
      accountStatus: 'active',
      lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    })
    created.push(user)
  }

  return NextResponse.json({ created: created.length, users: created })
}

import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const systems = await prisma.system.findMany({
      include: {
        dailyProduction: {
          orderBy: { productionDate: 'desc' },
          take: 90,
        },
        alerts: {
          where: { dismissed: false },
          orderBy: { createdAt: 'desc' },
        },
        maintenanceTasks: {
          where: { completed: false },
          orderBy: { dueDate: 'asc' },
        },
      },
    })

    return NextResponse.json(systems)
  } catch (error) {
    console.error('Error fetching systems:', error)
    return NextResponse.json(
      { error: 'Failed to fetch systems' },
      { status: 500 }
    )
  }
}

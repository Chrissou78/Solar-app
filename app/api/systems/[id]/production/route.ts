import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const production = await prisma.dailyProduction.findMany({
      where: { systemId: parseInt(id) },
      orderBy: { productionDate: 'asc' },
      take: 90,
    })

    return NextResponse.json(production)
  } catch (error) {
    console.error('Error fetching production data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch production data' },
      { status: 500 }
    )
  }
}

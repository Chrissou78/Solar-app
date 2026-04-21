import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { taskId } = await req.json()
    
    // Create a service booking record (you'll need to add this to your Prisma schema)
    // For now, just mark as scheduled
    await prisma.maintenanceTask.update({
      where: { id: taskId },
      data: { completed: true }, // or add a `scheduled` field
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to book maintenance' }, { status: 500 })
  }
}

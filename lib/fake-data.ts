import { prisma } from './prisma'

function generateDailyProduction(systemSizeKw: number, daysBack: number = 365) {
  const data = []
  const today = new Date()

  for (let i = daysBack; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)

    // Seasonal variation (more production in summer)
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)
    const seasonFactor = 1 + 0.4 * Math.sin((dayOfYear / 365) * Math.PI * 2)
    
    // Random weather variation (cloudiness 0-100%)
    const cloudiness = Math.random() * 100
    
    // Expected production on clear day (peaks at noon, varies by season)
    const expectedBase = systemSizeKw * 4.5 * seasonFactor
    const expected = expectedBase * (1 - cloudiness / 150)
    
    // Actual production varies slightly from expected
    const actual = expected * (0.85 + Math.random() * 0.25)

    data.push({
      productionDate: date,
      kwhProduced: Math.max(0, Math.round(actual * 100) / 100),
      expectedKwh: Math.max(0, Math.round(expected * 100) / 100),
      peakPowerKw: Math.round((systemSizeKw * 0.75 + Math.random() * systemSizeKw * 0.3) * 100) / 100,
    })
  }

  return data
}

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database with 1 year of production data...')
    
    await prisma.supportMessage.deleteMany({})
    await prisma.maintenanceTask.deleteMany({})
    await prisma.alert.deleteMany({})
    await prisma.dailyProduction.deleteMany({})
    await prisma.system.deleteMany({})
    await prisma.user.deleteMany({})

    const user = await prisma.user.create({
      data: {
        email: 'demo@example.com',
        password: 'demo123',
        language: 'en',
      },
    })

    const system = await prisma.system.create({
      data: {
        userId: user.id,
        systemName: 'Home Solar System',
        systemSizeKw: 8,
        installationDate: new Date('2023-06-15'),
        inverterType: 'Fronius',
        location: 'Austin, TX',
      },
    })

    // Generate 365 days of production data
    console.log('📊 Generating 365 days of production data...')
    const productionData = generateDailyProduction(8, 365)
    
    let createdCount = 0
    for (const data of productionData) {
      await prisma.dailyProduction.create({
        data: {
          systemId: system.id,
          ...data,
        },
      })
      createdCount++
      if (createdCount % 50 === 0) {
        console.log(`  ✓ Created ${createdCount}/${productionData.length} records`)
      }
    }

    // Create alerts
    console.log('🚨 Creating alerts...')
    await prisma.alert.create({
      data: {
        systemId: system.id,
        alertType: 'maintenance_due',
        title: 'Panel Cleaning Recommended',
        description: 'Your panels haven\'t been cleaned in 90 days. A cleaning can improve efficiency by 10-15%.',
        severity: 'warning',
      },
    })

    await prisma.alert.create({
      data: {
        systemId: system.id,
        alertType: 'info',
        title: 'System Performing Well',
        description: 'Your system produced 23% more energy than expected today due to clear skies.',
        severity: 'info',
      },
    })

    // Create maintenance tasks
    console.log('🔧 Creating maintenance tasks...')
    await prisma.maintenanceTask.create({
      data: {
        systemId: system.id,
        taskType: 'cleaning',
        title: 'Panel Cleaning',
        description: 'Regular cleaning to maintain efficiency',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
    })

    await prisma.maintenanceTask.create({
      data: {
        systemId: system.id,
        taskType: 'inspection',
        title: 'Annual System Inspection',
        description: 'Full system check and warranty review',
        dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      },
    })

    await prisma.maintenanceTask.create({
      data: {
        systemId: system.id,
        taskType: 'battery_check',
        title: 'Battery Health Check',
        description: 'Check battery voltage and connections',
        dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      },
    })

    console.log('✅ Database seeded successfully!')
    console.log(`📧 Demo user: demo@example.com / demo123`)
    console.log(`⚡ System ID: ${system.id}`)
    console.log(`📅 Production data: 365 days (${(productionData.reduce((sum, p) => sum + p.kwhProduced, 0)).toFixed(0)} kWh total)`)
  } catch (error) {
    console.error('❌ Seed error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

seedDatabase()

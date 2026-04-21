import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: systems, error } = await supabase
      .from("systems")
      .select(`
        *,
        alerts (*),
        maintenance_tasks (*),
        daily_production (*)
      `)
      .limit(1)

    if (error) throw error

    return NextResponse.json({ systems: systems || [] })
  } catch (error) {
    console.error("Error fetching systems:", error)
    return NextResponse.json(
      { error: "Failed to fetch systems" },
      { status: 500 }
    )
  }
}

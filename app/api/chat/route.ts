import { Anthropic } from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const client = new Anthropic()

export async function POST(request: Request) {
  try {
    const { message, systemInfo } = await request.json()

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: `You are a helpful solar energy support assistant. You help users understand their solar system performance, maintenance, and energy savings. 
      
      Current System Information:
      - System Name: ${systemInfo?.system_name || 'Unknown'}
      - Size: ${systemInfo?.system_size_kw || 'Unknown'}kW
      - Location: ${systemInfo?.location || 'Unknown'}
      - Type: ${systemInfo?.inverter_type || 'Unknown'}
      
      Be helpful, friendly, and provide actionable advice about solar systems.`,
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
    })

    const assistantMessage = response.content[0]
    if (assistantMessage.type !== 'text') {
      throw new Error('Unexpected response type')
    }

    return NextResponse.json({
      message: assistantMessage.text,
    })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}

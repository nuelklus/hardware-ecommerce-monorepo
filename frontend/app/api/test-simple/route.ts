import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  console.log('🧪 Simple test API called')
  return NextResponse.json({
    success: true,
    message: 'API routes are working!',
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: NextRequest) {
  console.log('🧪 Simple test API POST called')
  
  try {
    const body = await request.json()
    console.log('📝 Received body:', body)
    
    return NextResponse.json({
      success: true,
      message: 'POST request successful!',
      received: body,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

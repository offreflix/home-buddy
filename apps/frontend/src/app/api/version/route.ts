import { NextResponse } from 'next/server'
import { appVersion } from '@/lib/version'

export function GET() {
  return NextResponse.json({ version: appVersion })
}

import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import type { UploadApiResponse } from 'cloudinary'

// Force Node.js runtime and allow longer processing time
export const runtime = 'nodejs'
export const maxDuration = 60

// Prefer server-side envs; fallback to NEXT_PUBLIC only if set
const CLOUD_NAME =
  process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const API_KEY = process.env.CLOUDINARY_API_KEY
const API_SECRET = process.env.CLOUDINARY_API_SECRET

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
})

console.log('Cloudinary config on server:', {
  cloud_name: CLOUD_NAME,
  api_key: API_KEY ? 'set' : 'missing',
  api_secret: API_SECRET ? 'set' : 'missing',
})

function validateCloudinaryEnv() {
  const missing: string[] = []
  if (!CLOUD_NAME) missing.push('CLOUDINARY_CLOUD_NAME')
  if (!API_KEY) missing.push('CLOUDINARY_API_KEY')
  if (!API_SECRET) missing.push('CLOUDINARY_API_SECRET')
  return missing
}

export async function POST(request: NextRequest) {
  try {
    const missing = validateCloudinaryEnv()
    if (missing.length) {
      console.error('Cloudinary env missing:', missing.join(', '))
      return NextResponse.json(
        { error: `Cloudinary configuration missing: ${missing.join(', ')}` },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate type
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: 'Only image and video files are allowed' },
        { status: 400 }
      )
    }

    // Check video size limit
    if (isVideo && file.size > 70 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Video file too large. Please ensure video is under 60 seconds.' },
        { status: 400 }
      )
    }

    // Convert file -> Buffer -> base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64File = `data:${file.type};base64,${buffer.toString('base64')}`

    // Upload to Cloudinary
    const result: UploadApiResponse = await cloudinary.uploader.upload(base64File, {
      folder: 'dolly-hotel',
      resource_type: 'auto', // auto-detects image/video
      use_filename: true,
      unique_filename: true,
    })

    return NextResponse.json({
      success: true,
      secure_url: result.secure_url,
      public_id: result.public_id,
      resource_type: result.resource_type,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
    })
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Upload error details:', error.message)
      return NextResponse.json(
        { error: 'Upload failed', details: error.message },
        { status: 500 }
      )
    }

    console.error('Upload error details (non-Error):', error)
    return NextResponse.json(
      { error: 'Upload failed', details: String(error) },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const missing = validateCloudinaryEnv()
    if (missing.length) {
      console.error('Cloudinary env missing:', missing.join(', '))
      return NextResponse.json(
        { error: `Cloudinary configuration missing: ${missing.join(', ')}` },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const publicId = searchParams.get('publicId')
    const resourceType =
      (searchParams.get('resourceType') as 'image' | 'video' | 'raw' | 'auto') || 'image'

    if (!publicId) {
      return NextResponse.json({ error: 'Public ID is required' }, { status: 400 })
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType })

    if (result.result === 'ok') {
      return NextResponse.json({
        success: true,
        message: 'File deleted successfully',
        public_id: publicId,
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to delete file from Cloudinary', result: result.result },
        { status: 400 }
      )
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Delete error:', error.message)
      return NextResponse.json(
        { error: 'Delete failed', details: error.message },
        { status: 500 }
      )
    }

    console.error('Delete error (non-Error):', error)
    return NextResponse.json(
      { error: 'Delete failed', details: String(error) },
      { status: 500 }
    )
  }
}

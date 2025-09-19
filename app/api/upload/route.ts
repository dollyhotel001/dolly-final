import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

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
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type - allow both images and videos for room management
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')

    if (!isImage && !isVideo) {
      return NextResponse.json({ error: 'Only image and video files are allowed' }, { status: 400 })
    }

    // Additional validation for videos
    if (isVideo) {
      // Check file size (approximate check for 60s video limit)
      const maxVideoSize = 50 * 1024 * 1024 // 50MB (rough estimate for 60s video)
      if (file.size > maxVideoSize) {
        return NextResponse.json({
          error: 'Video file too large. Please ensure video is under 60 seconds.'
        }, { status: 400 })
      }
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const result = await new Promise<{
      secure_url: string; public_id: string; resource_type: string; format: string;
      width: number; height: number; bytes: number;
    }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: isVideo ? 'video' : 'image',
            folder: 'dolly-hotel',
            transformation: isVideo
              ? [{ width: 1280, height: 720, crop: 'limit', quality: 'auto', duration: '60' }]
              : [{ width: 1200, height: 800, crop: 'limit', quality: 'auto' }],
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary error:', error)
              reject(error)
            } else if (result) {
              resolve(result)
            } else {
              reject(new Error('Upload failed - no result'))
            }
          }
        )
        .end(buffer)
    })

    return NextResponse.json({
      secure_url: result.secure_url,
      public_id: result.public_id,
      resource_type: result.resource_type,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      success: true
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed. Please check your Cloudinary configuration.' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const publicId = searchParams.get('publicId')
    const resourceType = searchParams.get('resourceType') || 'image'

    if (!publicId) {
      return NextResponse.json({ error: 'Public ID is required' }, { status: 400 })
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType as 'image' | 'video' | 'raw' | 'auto'
    })

    if (result.result === 'ok') {
      return NextResponse.json({
        success: true,
        message: 'File deleted successfully',
        public_id: publicId
      })
    } else {
      return NextResponse.json({
        error: 'Failed to delete file from Cloudinary',
        result: result.result
      }, { status: 400 })
    }

  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Delete failed. Please check your Cloudinary configuration.' },
      { status: 500 }
    )
  }
}

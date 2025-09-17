/**
 * Utility functions for deleting files from Cloudinary
 */

/**
 * Determine resource type from public ID or URL
 */
function determineResourceType(publicIdOrUrl: string): 'image' | 'video' {
    // Check for video extensions or patterns
    const videoExtensions = ['.mp4', '.mov', '.avi', '.wmv', '.flv', '.webm', '.mkv'];
    const lowerStr = publicIdOrUrl.toLowerCase();

    const isVideo = videoExtensions.some(ext => lowerStr.includes(ext)) ||
        lowerStr.includes('/video/') ||
        lowerStr.includes('video');

    return isVideo ? 'video' : 'image';
}

/**
 * Delete a single file from Cloudinary
 */
export async function deleteFromCloudinary(publicId: string, resourceType?: 'image' | 'video') {
    try {
        // Auto-determine resource type if not provided
        const finalResourceType = resourceType || determineResourceType(publicId);

        const deleteResponse = await fetch(
            `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/upload?publicId=${encodeURIComponent(publicId)}&resourceType=${finalResourceType}`,
            {
                method: 'DELETE',
            }
        )

        if (!deleteResponse.ok) {
            const errorText = await deleteResponse.text()
            console.error(`Cloudinary deletion failed for ${publicId}:`, errorText)
            return false
        }

        const result = await deleteResponse.json()
        return result.success
    } catch (error) {
        console.error(`Cloudinary deletion error for ${publicId}:`, error)
        return false
    }
}

/**
 * Delete multiple files from Cloudinary
 */
export async function bulkDeleteFromCloudinary(publicIds: string[], resourceType?: 'image' | 'video') {
    const results = await Promise.allSettled(
        publicIds.map(publicId => deleteFromCloudinary(publicId, resourceType))
    )

    const successes = results.filter(result => result.status === 'fulfilled' && result.value).length
    const failures = results.length - successes

    console.log(`Cloudinary bulk deletion: ${successes} successful, ${failures} failed`)

    return {
        total: results.length,
        successes,
        failures,
        results
    }
}

/**
 * Extract public ID from Cloudinary URL
 */
export function extractPublicIdFromUrl(cloudinaryUrl: string): string | null {
    try {
        // Match patterns like:
        // https://res.cloudinary.com/cloud-name/image/upload/v1234567890/folder/public-id.jpg
        // https://res.cloudinary.com/cloud-name/video/upload/v1234567890/folder/public-id.mp4
        const match = cloudinaryUrl.match(/\/(?:image|video)\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/)
        return match ? match[1] : null
    } catch (error) {
        console.error('Error extracting public ID from URL:', error)
        return null
    }
}


/**
 * Determine resource type from Cloudinary URL
 */
export function getResourceTypeFromUrl(cloudinaryUrl: string): 'image' | 'video' {
    try {
        // Check if URL contains '/video/' or has video file extensions
        if (cloudinaryUrl.includes('/video/') || /\.(mp4|mov|avi|wmv|flv|webm|mkv)$/i.test(cloudinaryUrl)) {
            return 'video'
        }
        // Default to image for all other cases (including '/image/' and image extensions)
        return 'image'
    } catch (error) {
        console.error('Error determining resource type from URL:', error)
        return 'image' // Default fallback
    }
}
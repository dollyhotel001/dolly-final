'use client'

import { useState } from 'react'
import { ROOM_SPECS } from '@/lib/config'
import { Wifi, Snowflake, Tv, Droplets, Video, Car, ShowerHead } from 'lucide-react'
import Image from 'next/image'
import Modal from './Modal'
import RoomDetailsModal from './RoomDetailsModal'

interface CategoryCardProps {
    category: {
        id: number
        slug: string
        title: string
        description: string | null
        specs: Record<string, boolean>
        essentialAmenities?: string[]
        bedType?: string | null
        maxOccupancy?: number | null
        roomSize?: string | null
        roomCount: number
        videoUrl?: string | null
        images: Array<{
            id: number
            url: string
            caption: string | null
        }>
        prices?: Array<{
            id: number
            hourlyHours: number
            rateCents: number
        }>
    }
}

const getSpecIcon = (spec: string) => {
    switch (spec) {
        case 'wifi':
            return <Wifi className="w-4 h-4" />
        case 'ac':
            return <Snowflake className="w-4 h-4" />
        case 'tv':
            return <Tv className="w-4 h-4" />
        case 'geyser':
            return <Droplets className="w-4 h-4" />
        case 'cctv':
            return <Video className="w-4 h-4" />
        case 'parking':
            return <Car className="w-4 h-4" />
        case 'attached':
            return <ShowerHead className="w-4 h-4" />
        default:
            return null
    }
}

export default function CategoryCard({ category }: CategoryCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const mainImage = category.images[0]?.url || '/placeholder-room.svg'
    const hasVideo = category.videoUrl && category.videoUrl.trim() !== ''

    console.log('🏨 CategoryCard - Room:', category.title)
    console.log('🖼️ Main Image:', mainImage)
    console.log('🎬 Has Video:', hasVideo)
    console.log('📊 Images Count:', category.images?.length || 0)

    const roomData = {
        id: category.id,
        title: category.title,
        description: category.description || '',
        specs: category.specs,
        essentialAmenities: category.essentialAmenities || [],
        bedType: category.bedType || undefined,
        maxOccupancy: category.maxOccupancy || undefined,
        roomSize: category.roomSize || undefined,
        images: category.images,
        videoUrl: category.videoUrl || undefined
    }

    return (
        <>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {/* Image or Video */}
                <div className="relative h-48">
                    {hasVideo ? (
                        /* Show video when available */
                        <video
                            src={category.videoUrl!}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                            poster={mainImage}
                            onError={(e) => {
                                console.error('❌ Video failed to load:', category.videoUrl, e);
                                // Hide video and show image instead
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                    ) : (
                        /* Show image when no video */
                        <Image
                            src={mainImage}
                            alt={category.title}
                            width={400}
                            height={250}
                            className="w-full h-full object-cover"
                        />
                    )}
                    {/* Video Indicator Badge */}
                    {hasVideo && (
                        <div className="absolute bottom-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                            <Video className="w-3 h-3" />
                            Video
                        </div>
                    )}
                    <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-semibold">
                        {category.roomCount} Available
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                        {category.description}
                    </p>

                    {/* Specs */}
                    {category.specs && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {Object.entries(category.specs)
                                .filter(([, value]) => value)
                                .map(([spec]) => (
                                    <div key={spec} className="flex items-center gap-1 text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded">
                                        {getSpecIcon(spec)}
                                        <span>{ROOM_SPECS[spec as keyof typeof ROOM_SPECS] || spec}</span>
                                    </div>
                                ))}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-center">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                        >
                            View Details
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={category.title}
                maxWidth="max-w-4xl"
            >
                <RoomDetailsModal
                    room={roomData}
                    onClose={() => setIsModalOpen(false)}
                />
            </Modal>
        </>
    )
}
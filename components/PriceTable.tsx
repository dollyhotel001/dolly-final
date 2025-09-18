'use client'

import { useMemo, useCallback, useState } from 'react'
import useSWR from 'swr'
import { Check, Star, Clock, Zap, AlertCircle, RefreshCw } from 'lucide-react'

// Optimized fetcher with error handling and timeout
const fetcher = async (url: string) => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

    try {
        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'Cache-Control': 'max-age=60', // Cache for 1 minute
            }
        })
        clearTimeout(timeoutId)

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        return await response.json()
    } catch (error) {
        clearTimeout(timeoutId)
        throw error
    }
}

interface Price {
    id: number
    label?: string
    hourlyHours: number
    rateCents: number
    category: {
        id: number
        title: string
        specs?: Record<string, boolean>
    }
}

interface PriceTableProps {
    categoryId?: number
}

// Memoized feature generator for better performance
const useFeatures = (specs: Record<string, boolean> | undefined, hourlyHours: number) => {
    return useMemo(() => {
        const baseFeatures: string[] = []

        // Priority features based on specs
        if (specs?.wifi) baseFeatures.push('Free High-Speed WiFi')
        if (specs?.ac) baseFeatures.push('Climate Control AC')
        if (specs?.tv) baseFeatures.push('Smart TV & Streaming')
        if (specs?.geyser) baseFeatures.push('24/7 Hot Water')
        if (specs?.parking) baseFeatures.push('Complimentary Parking')

        // Time-based premium features
        if (hourlyHours >= 24) {
            baseFeatures.push('Complimentary Breakfast')
            baseFeatures.push('Late Checkout (2 PM)')
        } else if (hourlyHours >= 12) {
            baseFeatures.push('Welcome Refreshments')
        } else {
            baseFeatures.push('Express Check-in')
        }

        // Fill remaining slots with premium amenities
        const premiumFeatures = [
            'Premium Room Service',
            '24/7 Concierge Support',
            'Housekeeping Service',
            'Complimentary Toiletries',
            'High-Speed Internet',
            'In-room Coffee/Tea'
        ]

        premiumFeatures.forEach(feature => {
            if (baseFeatures.length < 6 && !baseFeatures.includes(feature)) {
                baseFeatures.push(feature)
            }
        })

        return baseFeatures.slice(0, 6) // Limit to 6 features for better UX
    }, [specs, hourlyHours])
}

// Memoized price card component
const PriceCard = ({
    price,
    index,
    isBestValue,
    isPopular,
    onSelect
}: {
    price: Price
    index: number
    isBestValue: boolean
    isPopular: boolean
    onSelect: (price: Price) => void
}) => {
    const features = useFeatures(price.category.specs, price.hourlyHours)
    const [isHovered, setIsHovered] = useState(false)

    const formattedPrice = useMemo(() =>
        (price.rateCents / 100).toLocaleString('en-IN'),
        [price.rateCents]
    )

    const durationLabel = useMemo(() =>
        price.label || `${price.hourlyHours}${price.hourlyHours === 1 ? ' Hour' : ' Hours'}`,
        [price.label, price.hourlyHours]
    )

    const handleSelect = useCallback(() => {
        onSelect(price)
    }, [price, onSelect])

    return (
        <div
            className={`relative bg-white rounded-3xl shadow-lg border-2 transition-all duration-500 ease-out transform hover:scale-[1.02] group/card w-full max-w-sm mx-auto overflow-hidden ${isBestValue
                ? 'border-yellow-400 ring-4 ring-yellow-100 shadow-yellow-100/50'
                : isHovered
                    ? 'border-yellow-300 shadow-xl shadow-gray-200/60'
                    : 'border-gray-200 hover:border-yellow-300'
                }`}
            style={{
                animationDelay: `${index * 150}ms`,
                transformOrigin: 'center bottom'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Gradient Background Effect */}
            <div className={`absolute inset-0 opacity-0 transition-opacity duration-500 ${isHovered ? 'opacity-100' : ''
                }`}>
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/80 via-transparent to-orange-50/40" />
            </div>

            {/* Best Value Badge */}
            {isBestValue && (
                <div className="absolute top-4 left-4 z-10">
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        Best Value
                    </div>
                </div>
            )}

            {/* Popular Badge */}
            {isPopular && !isBestValue && (
                <div className="absolute -top-3 -right-3 z-10">
                    <div className="bg-gradient-to-br from-orange-400 to-red-500 text-white w-18 h-18 rounded-full flex items-center justify-center text-xs font-bold shadow-xl animate-pulse">
                        <div className="text-center">
                            <Zap className="w-4 h-4 mx-auto mb-1" />
                            <div>Popular</div>
                        </div>
                    </div>
                </div>
            )}

            <div className="relative p-6 z-10">
                {/* Duration Header */}
                <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <Clock className="w-5 h-5 text-yellow-600" />
                        <h4 className="text-2xl font-bold text-gray-900">
                            {durationLabel}
                        </h4>
                    </div>
                    <div className="text-sm text-gray-500 font-medium">
                        {price.hourlyHours >= 24 ? 'Premium Full Day Experience' : 'Flexible Hourly Stay'}
                    </div>
                </div>

                {/* Price Display */}
                <div className="text-center mb-8 relative">
                    <div className="text-5xl font-bold text-gray-900 mb-2 tracking-tight">
                        ₹{formattedPrice}
                    </div>
                    <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">
                        {price.hourlyHours >= 24 ? 'Per Day' : 'Per Hour'}
                    </div>

                    {/* Save percentage badge */}
                    {isBestValue && (
                        <div className="absolute top-4 right-4 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">
                            Save 20%
                        </div>
                    )}
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                    {features.map((feature, featureIndex) => (
                        <div
                            key={feature}
                            className="flex items-center text-sm text-gray-700 group/feature"
                            style={{ animationDelay: `${(index * 150) + (featureIndex * 100)}ms` }}
                        >
                            <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mr-3 transition-all duration-300 ${isBestValue ? 'bg-yellow-100' : 'bg-gray-100 group-hover/card:bg-yellow-50'
                                }`}>
                                <Check className={`w-3 h-3 transition-colors duration-300 ${isBestValue ? 'text-yellow-600' : 'text-gray-600 group-hover/card:text-yellow-600'
                                    }`} />
                            </div>
                            <span className="group-hover/card:text-gray-900 transition-colors duration-300 font-medium">
                                {feature}
                            </span>
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
                <button
                    onClick={handleSelect}
                    className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform group-hover/card:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-opacity-50 ${isBestValue
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg hover:shadow-xl focus:ring-yellow-300 hover:from-yellow-500 hover:to-yellow-700'
                        : 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl focus:ring-gray-300'
                        }`}
                >
                    Select This Plan
                </button>

                {/* Additional Info */}
                <p className="text-xs text-gray-500 text-center mt-3 font-medium">
                    Instant confirmation • Free cancellation
                </p>
            </div>
        </div>
    )
}

export default function PriceTable({ categoryId }: PriceTableProps) {
    const [retryCount, setRetryCount] = useState(0)

    const { data, error, isLoading, mutate } = useSWR(
        categoryId
            ? `/api/prices?categoryId=${categoryId}`
            : '/api/prices',
        fetcher,
        {
            refreshInterval: 60000, // Refresh every 60 seconds (less aggressive)
            revalidateOnFocus: false, // Disable to reduce server load
            revalidateOnMount: true,
            revalidateOnReconnect: true,
            errorRetryCount: 3,
            errorRetryInterval: 5000,
            dedupingInterval: 30000, // Dedupe requests for 30 seconds
            onError: () => setRetryCount(prev => prev + 1)
        }
    )

    // Memoized grouped prices for better performance
    const groupedPrices = useMemo(() => {
        if (!data?.data || !Array.isArray(data.data)) return {}

        return (data.data as Price[]).reduce((acc: Record<string, Price[]>, price: Price) => {
            const categoryTitle = price.category.title
            if (!acc[categoryTitle]) {
                acc[categoryTitle] = []
            }
            acc[categoryTitle].push(price)
            return acc
        }, {})
    }, [data?.data])

    // Memoized best value calculation
    const getBestValueIndex = useCallback((prices: Price[]) => {
        if (prices.length < 2) return -1
        // Find the option with best value per hour
        const valueIndexes = prices.map((price, index) => ({
            index,
            valuePerHour: price.rateCents / price.hourlyHours
        }))
        valueIndexes.sort((a, b) => a.valuePerHour - b.valuePerHour)
        return valueIndexes[0]?.index ?? -1
    }, [])

    // Handle plan selection
    const handlePlanSelect = useCallback((price: Price) => {
        // Redirect to contact page
        window.location.href = '/contact'
    }, [])

    // Manual retry function
    const handleRetry = useCallback(() => {
        setRetryCount(0)
        mutate()
    }, [mutate])

    // Loading state with skeleton
    if (isLoading && retryCount === 0) {
        return (
            <div className="space-y-12 animate-pulse">
                <div className="text-center">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-200">
                        <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
                        <div className="w-32 h-4 bg-gray-300 rounded"></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-gray-100 rounded-3xl p-6 space-y-4 max-w-sm mx-auto">
                            <div className="h-8 bg-gray-200 rounded-lg"></div>
                            <div className="h-12 bg-gray-200 rounded-lg"></div>
                            <div className="space-y-2">
                                {[1, 2, 3, 4].map(j => (
                                    <div key={j} className="h-4 bg-gray-200 rounded"></div>
                                ))}
                            </div>
                            <div className="h-12 bg-gray-200 rounded-2xl"></div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    // Error state with retry option
    if (error) {
        return (
            <div className="text-center py-16">
                <div className="bg-red-50 border-2 border-red-100 rounded-3xl p-8 max-w-md mx-auto">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-red-800 text-xl font-bold mb-2">
                        Unable to Load Pricing
                    </h3>
                    <p className="text-red-600 mb-4">
                        {retryCount > 2
                            ? 'Please check your internet connection and try again.'
                            : 'Something went wrong while loading prices.'}
                    </p>
                    <button
                        onClick={handleRetry}
                        className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors duration-200 flex items-center gap-2 mx-auto"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    // Empty state
    if (!Object.keys(groupedPrices).length) {
        return (
            <div className="text-center py-16">
                <div className="bg-gray-50 border-2 border-gray-200 rounded-3xl p-8 max-w-md mx-auto">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-gray-700 text-xl font-bold mb-2">
                        No Pricing Available
                    </h3>
                    <p className="text-gray-500 mb-4">
                        Pricing information is currently being updated.
                    </p>
                    <p className="text-xs text-gray-400">
                        Please check back in a few minutes or contact us directly.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-16">
            {/* Live Data Indicator */}
            <div className="text-center">
                <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-green-50 to-blue-50 text-gray-700 border border-green-200 shadow-sm">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse shadow-lg shadow-green-500/50"></div>
                    <span className="font-semibold">Live Pricing</span>
                    <span className="text-gray-500 ml-2">• Updated automatically</span>
                </div>
            </div>

            {/* Price Categories */}
            {Object.entries(groupedPrices).map(([categoryTitle, prices], categoryIndex) => {
                const bestValueIndex = getBestValueIndex(prices)
                const sortedPrices = [...prices].sort((a, b) => a.hourlyHours - b.hourlyHours)

                return (
                    <section
                        key={categoryTitle}
                        className="animate-fade-in-up"
                        style={{ animationDelay: `${categoryIndex * 300}ms` }}
                    >
                        {/* Category Header */}
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                                {categoryTitle}
                            </h2>
                            <p className="text-lg text-gray-600 mb-4">
                                {sortedPrices.length} flexible pricing {sortedPrices.length === 1 ? 'option' : 'options'}
                                <span className="text-yellow-600 font-semibold"> • Choose what works best for you</span>
                            </p>
                            <div className="w-32 h-1.5 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-full mx-auto shadow-lg"></div>
                        </div>

                        {/* Pricing Grid */}
                        <div className="flex justify-center">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl">
                                {sortedPrices.map((price, index) => (
                                    <PriceCard
                                        key={price.id}
                                        price={price}
                                        index={index}
                                        isBestValue={index === bestValueIndex}
                                        isPopular={price.hourlyHours === 24}
                                        onSelect={handlePlanSelect}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                )
            })}

            {/* Trust Indicators */}
            <div className="text-center py-8 border-t border-gray-100">
                <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>Instant Confirmation</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>Free Cancellation</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>Best Price Guarantee</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
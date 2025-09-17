'use client'

import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

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

export default function PriceTable({ categoryId }: PriceTableProps) {
    const { data, error, isLoading } = useSWR(
        categoryId
            ? `/api/prices?categoryId=${categoryId}`
            : '/api/prices',
        fetcher,
        {
            refreshInterval: 30000, // Refresh every 30 seconds to show real-time updates
            revalidateOnFocus: true, // Revalidate when window gets focus
            revalidateOnMount: true, // Always revalidate on mount
        }
    )

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-16">
                <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-200"></div>
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent absolute top-0 left-0"></div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-16">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
                    <div className="text-red-600 text-lg font-medium mb-2">Oops! Something went wrong</div>
                    <div className="text-red-500">Error loading prices. Please try again later.</div>
                </div>
            </div>
        )
    }

    if (!data?.data || data.data.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 max-w-md mx-auto">
                    <div className="text-gray-600 text-lg font-medium mb-2">No Prices Available</div>
                    <div className="text-gray-500">Please check back later for updated pricing.</div>
                    <div className="text-xs text-gray-400 mt-2">
                        Data refreshes automatically every 30 seconds
                    </div>
                </div>
            </div>
        )
    }

    // Group prices by category
    const groupedPrices = data.data.reduce((acc: Record<string, Price[]>, price: Price) => {
        const categoryTitle = price.category.title
        if (!acc[categoryTitle]) {
            acc[categoryTitle] = []
        }
        acc[categoryTitle].push(price)
        return acc
    }, {})

    const getBestValueIndex = (prices: Price[]) => {
        if (prices.length < 2) return -1
        return Math.floor(prices.length / 2) // Middle option as best value
    }

    const getFeatures = (specs: Record<string, boolean> | undefined, hourlyHours: number) => {
        const baseFeatures = []

        if (specs?.wifi) baseFeatures.push('Free WiFi')
        if (specs?.parking) baseFeatures.push('Free Parking')
        if (specs?.ac) baseFeatures.push('Air Conditioning')
        if (specs?.tv) baseFeatures.push('Smart TV')
        if (specs?.geyser) baseFeatures.push('Hot Water')

        // Add time-based features
        if (hourlyHours >= 12) {
            baseFeatures.push('Complimentary Breakfast')
        } else {
            baseFeatures.push('Welcome Drink')
        }

        // Ensure we have at least 4 features
        while (baseFeatures.length < 4) {
            const additionalFeatures = ['Room Service', 'Fitness Center Access', '24/7 Security', 'Laundry Service']
            for (const feature of additionalFeatures) {
                if (!baseFeatures.includes(feature) && baseFeatures.length < 4) {
                    baseFeatures.push(feature)
                }
            }
        }

        return baseFeatures.slice(0, 4) // Limit to 4 features
    }

    return (
        <div className="space-y-12">
            {/* Live Data Indicator */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    Live Pricing • Updates automatically
                </div>
            </div>

            {(Object.entries(groupedPrices) as [string, Price[]][]).map(([categoryTitle, prices], categoryIndex) => {
                const bestValueIndex = getBestValueIndex(prices)

                return (
                    <div
                        key={categoryTitle}
                        className="group animate-fade-in-up"
                        style={{ animationDelay: `${categoryIndex * 200}ms` }}
                    >
                        {/* Category Header */}
                        <div className="text-center mb-8">
                            <h3 className="text-3xl font-bold text-gray-900 mb-2">{categoryTitle}</h3>
                            <div className="text-sm text-gray-500 mb-3">
                                {prices.length} pricing {prices.length === 1 ? 'option' : 'options'} available
                            </div>
                            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mx-auto"></div>
                        </div>

                        {/* Pricing Cards */}
                        <div className="flex justify-center">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
                                {prices.map((price: Price, index) => {
                                    const isBestValue = index === bestValueIndex
                                    const isPopular = price.hourlyHours === 24 // Day stay is popular

                                    return (
                                        <div
                                            key={price.id}
                                            className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-500 hover:shadow-2xl hover:scale-105 group/card w-full max-w-md mx-auto ${isBestValue
                                                ? 'border-yellow-400 ring-4 ring-yellow-100'
                                                : 'border-gray-200 hover:border-yellow-300'
                                                }`}
                                            style={{ animationDelay: `${index * 100}ms` }}
                                        >
                                            {/* Best Value Badge */}
                                            {isBestValue && (
                                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                                                        Best Value
                                                    </div>
                                                </div>
                                            )}

                                            {/* Popular Badge */}
                                            {isPopular && !isBestValue && (
                                                <div className="absolute -top-3 -right-3">
                                                    <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
                                                        Popular
                                                    </div>
                                                </div>
                                            )}

                                            <div className="p-6">
                                                {/* Duration */}
                                                <div className="text-center mb-6">
                                                    <div className="text-2xl font-bold text-gray-900 mb-2">
                                                        {price.label || `${price.hourlyHours}${price.hourlyHours === 1 ? ' Hour' : ' Hours'}`}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {price.hourlyHours >= 24 ? 'Full Day Experience' : 'Hourly Rate'}
                                                    </div>
                                                </div>

                                                {/* Price */}
                                                <div className="text-center mb-6">
                                                    <div className="text-4xl font-bold text-gray-900 mb-2">
                                                        ₹{(price.rateCents / 100).toLocaleString()}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {price.hourlyHours >= 24 ? 'per day' : 'per hour'}
                                                    </div>
                                                </div>

                                                {/* Features */}
                                                <div className="space-y-3 mb-6">
                                                    {getFeatures(price.category.specs, price.hourlyHours).map((feature, featureIndex) => (
                                                        <div
                                                            key={feature}
                                                            className="flex items-center text-sm text-gray-600"
                                                            style={{ animationDelay: `${(index * 100) + (featureIndex * 50)}ms` }}
                                                        >
                                                            <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mr-3 flex-shrink-0 group-hover/card:scale-125 transition-transform duration-300"></div>
                                                            <span className="group-hover/card:text-gray-800 transition-colors duration-300">{feature}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* CTA Button */}
                                                <button className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform group-hover/card:scale-105 ${isBestValue
                                                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg hover:shadow-xl'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 border-2 border-gray-200 hover:border-yellow-300'
                                                    }`}>
                                                    Select This Plan
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
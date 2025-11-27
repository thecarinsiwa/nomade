"use client"

import Image from "next/image"
import Link from "next/link"
import { MapPin, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

interface DestinationCardProps {
  id: string
  name: string
  location: string
  image: string
  price: number
  rating: number
  reviewCount: number
  badge?: string
}

export function DestinationCard({
  id,
  name,
  location,
  image,
  price,
  rating,
  reviewCount,
  badge,
}: DestinationCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/destination/${id}`}>
        <Card className="overflow-hidden cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-shadow">
          <div className="relative h-64 w-full">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover"
            />
            {badge && (
              <div className="absolute top-4 left-4">
                <Badge variant="secondary">{badge}</Badge>
              </div>
            )}
          </div>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{name}</h3>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{location}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{rating}</span>
                <span className="text-sm text-gray-500">({reviewCount})</span>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">€{price}</p>
                <p className="text-xs text-gray-500">par nuit</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}


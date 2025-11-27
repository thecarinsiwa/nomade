"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface OfferCardProps {
  id: string
  title: string
  description: string
  image: string
  discount: number
  destination: string
}

export function OfferCard({
  id,
  title,
  description,
  image,
  discount,
  destination,
}: OfferCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/destination/${id}`}>
        <Card className="relative overflow-hidden cursor-pointer border-0 shadow-xl hover:shadow-2xl transition-shadow">
          <div className="relative h-80 w-full">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute top-4 right-4">
              <Badge variant="destructive" className="text-lg px-4 py-2">
                -{discount}%
              </Badge>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">{title}</h3>
              <p className="text-white/90 mb-4">{description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/80">{destination}</span>
                <Button variant="secondary" size="sm">
                  Découvrir
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}


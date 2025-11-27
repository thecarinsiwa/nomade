"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Calendar, Users, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"

interface SearchBarProps {
  variant?: "default" | "compact"
}

export function SearchBar({ variant = "default" }: SearchBarProps) {
  const router = useRouter()
  const [destination, setDestination] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState("2")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams({
      destination: destination || "Paris",
      checkIn: checkIn || new Date().toISOString().split("T")[0],
      checkOut: checkOut || new Date(Date.now() + 86400000).toISOString().split("T")[0],
      guests: guests || "2",
    })
    router.push(`/search?${params.toString()}`)
  }

  if (variant === "compact") {
    return (
      <form onSubmit={handleSearch} className="flex items-center gap-2 w-full">
        <div className="flex-1 relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Où allez-vous ?"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" className="px-6">
          <Search className="h-4 w-4 mr-2" />
          Rechercher
        </Button>
      </form>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-5xl mx-auto"
    >
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="number"
            placeholder="Voyageurs"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            min="1"
            className="pl-10"
          />
        </div>
        <Button type="submit" className="md:col-span-4 w-full md:w-auto md:px-8">
          <Search className="h-4 w-4 mr-2" />
          Rechercher
        </Button>
      </form>
    </motion.div>
  )
}


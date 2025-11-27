"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { DestinationCard } from "@/components/destination-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Search, Filter, X, ArrowUpDown } from "lucide-react"
import { motion } from "framer-motion"

// Mock data
const mockResults = [
  {
    id: "1",
    name: "Hôtel Plaza Paris",
    location: "Paris, France",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    price: 120,
    rating: 4.8,
    reviewCount: 324,
    badge: "Populaire",
  },
  {
    id: "2",
    name: "Resort Maldives",
    location: "Maldives",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
    price: 350,
    rating: 4.9,
    reviewCount: 512,
    badge: "Luxe",
  },
  {
    id: "3",
    name: "Boutique Hotel Tokyo",
    location: "Tokyo, Japon",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
    price: 180,
    rating: 4.7,
    reviewCount: 289,
  },
  {
    id: "4",
    name: "Beach Resort Bali",
    location: "Bali, Indonésie",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
    price: 150,
    rating: 4.6,
    reviewCount: 456,
    badge: "Meilleur prix",
  },
  {
    id: "5",
    name: "Mountain Lodge",
    location: "Alpes, Suisse",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    price: 200,
    rating: 4.8,
    reviewCount: 198,
  },
  {
    id: "6",
    name: "City Center Hotel",
    location: "New York, USA",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
    price: 250,
    rating: 4.5,
    reviewCount: 623,
  },
  {
    id: "7",
    name: "Seaside Villa",
    location: "Santorini, Grèce",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
    price: 220,
    rating: 4.9,
    reviewCount: 412,
    badge: "Nouveau",
  },
  {
    id: "8",
    name: "Desert Oasis",
    location: "Marrakech, Maroc",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    price: 130,
    rating: 4.4,
    reviewCount: 267,
  },
]

type SortOption = "price-asc" | "price-desc" | "rating" | "popularity"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 500])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<SortOption>("popularity")
  const [results, setResults] = useState(mockResults)

  const destination = searchParams.get("destination") || "Toutes destinations"
  const checkIn = searchParams.get("checkIn") || ""
  const checkOut = searchParams.get("checkOut") || ""
  const guests = searchParams.get("guests") || "2"

  useEffect(() => {
    // Simulate filtering and sorting
    let filtered = [...mockResults]

    // Filter by price
    filtered = filtered.filter(
      (item) => item.price >= priceRange[0] && item.price <= priceRange[1]
    )

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "popularity":
          return b.reviewCount - a.reviewCount
        default:
          return 0
      }
    })

    setResults(filtered)
  }, [priceRange, sortBy, selectedTypes])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Search Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Résultats de recherche
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <span>{destination}</span>
              {checkIn && <span>•</span>}
              {checkIn && <span>{new Date(checkIn).toLocaleDateString("fr-FR")}</span>}
              {checkOut && <span>-</span>}
              {checkOut && <span>{new Date(checkOut).toLocaleDateString("fr-FR")}</span>}
              <span>•</span>
              <span>{guests} {guests === "1" ? "voyageur" : "voyageurs"}</span>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Filters Sidebar */}
            <aside className={`hidden lg:block w-80 ${showFilters ? "lg:hidden" : ""}`}>
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Filtres</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-4">Prix par nuit</h3>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={500}
                    min={0}
                    step={10}
                    className="mb-4"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>€{priceRange[0]}</span>
                    <span>€{priceRange[1]}</span>
                  </div>
                </div>

                {/* Property Type */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-4">Type d&apos;hébergement</h3>
                  <div className="space-y-2">
                    {["Hôtel", "Résidence", "Appartement", "Villa"].map((type) => (
                      <label key={type} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedTypes.includes(type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTypes([...selectedTypes, type])
                            } else {
                              setSelectedTypes(selectedTypes.filter((t) => t !== type))
                            }
                          }}
                          className="rounded"
                        />
                        <span>{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button className="w-full" onClick={() => setShowFilters(false)}>
                  Appliquer les filtres
                </Button>
              </div>
            </aside>

            {/* Results */}
            <div className="flex-1">
              {/* Sort and Filter Toggle */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filtres
                  </Button>
                  <p className="text-sm text-gray-600">
                    {results.length} résultat{results.length > 1 ? "s" : ""} trouvé{results.length > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-gray-600" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="border rounded-md px-3 py-2 text-sm"
                  >
                    <option value="popularity">Popularité</option>
                    <option value="price-asc">Prix croissant</option>
                    <option value="price-desc">Prix décroissant</option>
                    <option value="rating">Meilleure note</option>
                  </select>
                </div>
              </div>

              {/* Results Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((result, index) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <DestinationCard {...result} />
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-8 gap-2">
                <Button variant="outline" disabled>
                  Précédent
                </Button>
                <Button variant="default">1</Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <Button variant="outline">
                  Suivant
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}


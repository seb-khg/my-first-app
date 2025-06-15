"use client"

import { useState } from "react"
import { MoreHorizontal, Edit, Trash2, Music, Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"

interface Artist {
  id: string
  name: string
  genre: string
  image?: string
}

interface ArtistCardProps {
  artist: Artist
  onEdit: () => void
  onDelete: () => void
}

export function ArtistCard({ artist, onEdit, onDelete }: ArtistCardProps) {
  const [imageError, setImageError] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  const hasValidImage = artist.image && !imageError && artist.image.trim() !== ""

  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white/90 hover:-translate-y-2 overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          <div className="aspect-square overflow-hidden bg-gradient-to-br from-violet-100 via-purple-100 to-pink-100">
            {hasValidImage ? (
              <Image
                src={artist.image || "/placeholder.svg?height=300&width=300"}
                alt={artist.name}
                width={300}
                height={300}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-200 via-purple-200 to-pink-200">
                <Music className="w-16 h-16 text-violet-400" />
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg border-0"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart
                className={`h-4 w-4 transition-colors ${isLiked ? "text-red-500 fill-red-500" : "text-slate-600"}`}
              />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg border-0"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-sm">
                <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Artist
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="cursor-pointer text-red-600 focus:text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Artist
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
            <Button
              size="icon"
              className="h-12 w-12 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-xl border-0 transform scale-90 group-hover:scale-100 transition-transform duration-200"
            >
              <div className="w-0 h-0 border-l-[8px] border-l-violet-600 border-y-[6px] border-y-transparent ml-1" />
            </Button>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-bold text-slate-900 mb-2 line-clamp-1 text-lg" title={artist.name}>
            {artist.name}
          </h3>
          <Badge
            variant="secondary"
            className="bg-gradient-to-r from-violet-100 via-purple-100 to-pink-100 text-violet-700 border-0 hover:from-violet-200 hover:via-purple-200 hover:to-pink-200 font-medium"
          >
            {artist.genre}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

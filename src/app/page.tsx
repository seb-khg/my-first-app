"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Filter, SortAsc, SortDesc } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArtistCard } from "@/components/artist-card"
import { AddArtistDialog } from "@/components/add-artist-dialog"
import { EditArtistDialog } from "@/components/edit-artist-dialog"
import { DeleteArtistDialog } from "@/components/delete-artist-dialog"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

interface Artist {
  id: string
  name: string
  genre: string
  image: string
  created_at?: string
}

export default function ArtistDashboard() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("name-asc")
  const [isLoading, setIsLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null)
  const [deletingArtist, setDeletingArtist] = useState<Artist | null>(null)

  // Fetch artists from Supabase
  const fetchArtists = async () => {
    try {
      const { data, error } = await supabase.from("artists").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setArtists(data || [])
    } catch (error) {
      console.error("Error fetching artists:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchArtists()
  }, [])

  // Filter and sort artists
  useEffect(() => {
    const filtered = artists.filter((artist) => {
      const matchesSearch =
        artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artist.genre.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesGenre = selectedGenre === "all" || artist.genre === selectedGenre
      return matchesSearch && matchesGenre
    })

    // Sort artists
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name)
        case "name-desc":
          return b.name.localeCompare(a.name)
        case "genre-asc":
          return a.genre.localeCompare(b.genre)
        case "genre-desc":
          return b.genre.localeCompare(a.genre)
        default:
          return 0
      }
    })

    setFilteredArtists(filtered)
  }, [artists, searchTerm, selectedGenre, sortBy])

  const genres = Array.from(new Set(artists.map((artist) => artist.genre)))

  const handleAddArtist = async (artistData: Omit<Artist, "id">) => {
    try {
      const { error } = await supabase.from("artists").insert([artistData])

      if (error) throw error
      await fetchArtists()
      setShowAddDialog(false)
    } catch (error) {
      console.error("Error adding artist:", error)
    }
  }

  const handleEditArtist = async (id: string, artistData: Omit<Artist, "id">) => {
    try {
      const { error } = await supabase.from("artists").update(artistData).eq("id", id)

      if (error) throw error
      await fetchArtists()
      setEditingArtist(null)
    } catch (error) {
      console.error("Error updating artist:", error)
    }
  }

  const handleDeleteArtist = async (id: string) => {
    try {
      const { error } = await supabase.from("artists").delete().eq("id", id)

      if (error) throw error
      await fetchArtists()
      setDeletingArtist(null)
    } catch (error) {
      console.error("Error deleting artist:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div
              className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-pink-400 rounded-full animate-spin mx-auto"
              style={{ animationDelay: "0.1s", animationDuration: "1.2s" }}
            ></div>
          </div>
          <p className="text-slate-600 font-medium">Loading your artists...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">🎵</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Artist Dashboard
                  </h1>
                  <p className="text-sm text-slate-500">Manage your music collection</p>
                </div>
              </div>
              <Badge
                variant="secondary"
                className="hidden sm:inline-flex bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 border-0"
              >
                {artists.length} {artists.length === 1 ? "Artist" : "Artists"}
              </Badge>
            </div>
            <Button
              onClick={() => setShowAddDialog(true)}
              className="bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 hover:from-violet-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Artist
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <Card className="mb-8 shadow-lg border-0 bg-white/70 backdrop-blur-sm animate-slide-up">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search artists or genres..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-slate-200 focus:border-violet-300 focus:ring-violet-200 bg-white/50 backdrop-blur-sm"
                />
              </div>
              <div className="flex gap-3">
                <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                  <SelectTrigger className="w-[140px] border-slate-200 bg-white/50 backdrop-blur-sm">
                    <Filter className="w-4 h-4 mr-2 text-violet-500" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genres</SelectItem>
                    {genres.map((genre) => (
                      <SelectItem key={genre} value={genre}>
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px] border-slate-200 bg-white/50 backdrop-blur-sm">
                    {sortBy.includes("asc") ? (
                      <SortAsc className="w-4 h-4 mr-2 text-violet-500" />
                    ) : (
                      <SortDesc className="w-4 h-4 mr-2 text-violet-500" />
                    )}
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name-asc">Name A-Z</SelectItem>
                    <SelectItem value="name-desc">Name Z-A</SelectItem>
                    <SelectItem value="genre-asc">Genre A-Z</SelectItem>
                    <SelectItem value="genre-desc">Genre Z-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Artists Grid */}
        {filteredArtists.length === 0 ? (
          <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm animate-fade-in">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-violet-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🎤</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                {searchTerm || selectedGenre !== "all" ? "No artists found" : "No artists yet"}
              </h3>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                {searchTerm || selectedGenre !== "all"
                  ? "Try adjusting your search or filter criteria to find what you're looking for"
                  : "Start building your music collection by adding your first artist"}
              </p>
              {!searchTerm && selectedGenre === "all" && (
                <Button
                  onClick={() => setShowAddDialog(true)}
                  className="bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 hover:from-violet-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Artist
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredArtists.map((artist, index) => (
              <div key={artist.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <ArtistCard
                  artist={artist}
                  onEdit={() => setEditingArtist(artist)}
                  onDelete={() => setDeletingArtist(artist)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dialogs */}
      <AddArtistDialog open={showAddDialog} onOpenChange={setShowAddDialog} onAdd={handleAddArtist} />

      {editingArtist && (
        <EditArtistDialog
          open={!!editingArtist}
          onOpenChange={() => setEditingArtist(null)}
          artist={editingArtist}
          onEdit={handleEditArtist}
        />
      )}

      {deletingArtist && (
        <DeleteArtistDialog
          open={!!deletingArtist}
          onOpenChange={() => setDeletingArtist(null)}
          artist={deletingArtist}
          onDelete={handleDeleteArtist}
        />
      )}
    </div>
  )
}

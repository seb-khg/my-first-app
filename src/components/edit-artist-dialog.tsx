"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Edit, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Artist {
  id: string
  name: string
  genre: string
  image: string
}

interface EditArtistDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  artist: Artist
  onEdit: (id: string, artist: Omit<Artist, "id">) => Promise<void>
}

export function EditArtistDialog({ open, onOpenChange, artist, onEdit }: EditArtistDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    genre: "",
    image: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (artist) {
      setFormData({
        name: artist.name,
        genre: artist.genre,
        image: artist.image,
      })
    }
  }, [artist])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.genre.trim()) return

    setIsSubmitting(true)
    try {
      await onEdit(artist.id, formData)
    } catch (error) {
      console.error("Error updating artist:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
              <Edit className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
                Edit Artist
              </div>
            </div>
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Update the artist information below to make changes to your collection.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="edit-name" className="text-sm font-medium text-slate-700">
              Artist Name *
            </Label>
            <Input
              id="edit-name"
              placeholder="Enter artist name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="border-slate-200 focus:border-blue-300 focus:ring-blue-200 bg-white/50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-genre" className="text-sm font-medium text-slate-700">
              Genre *
            </Label>
            <Input
              id="edit-genre"
              placeholder="e.g., Pop, Rock, Jazz, Hip-Hop"
              value={formData.genre}
              onChange={(e) => handleChange("genre", e.target.value)}
              className="border-slate-200 focus:border-blue-300 focus:ring-blue-200 bg-white/50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-image" className="text-sm font-medium text-slate-700">
              Image URL
            </Label>
            <div className="relative">
              <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                id="edit-image"
                type="url"
                placeholder="https://example.com/artist-image.jpg"
                value={formData.image}
                onChange={(e) => handleChange("image", e.target.value)}
                className="pl-10 border-slate-200 focus:border-blue-300 focus:ring-blue-200 bg-white/50"
              />
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="border-slate-200 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.name.trim() || !formData.genre.trim() || isSubmitting}
              className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 hover:from-blue-600 hover:via-cyan-600 hover:to-teal-600 text-white shadow-lg"
            >
              {isSubmitting ? "Updating..." : "Update Artist"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

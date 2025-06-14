"use client"

import type React from "react"
import { useState } from "react"
import { Plus, Upload } from "lucide-react"
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
  name: string
  genre: string
  image: string
}

interface AddArtistDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (artist: Artist) => Promise<void>
}

export function AddArtistDialog({ open, onOpenChange, onAdd }: AddArtistDialogProps) {
  const [formData, setFormData] = useState<Artist>({
    name: "",
    genre: "",
    image: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.genre.trim()) return

    setIsSubmitting(true)
    try {
      await onAdd(formData)
      setFormData({ name: "", genre: "", image: "" })
    } catch (error) {
      console.error("Error adding artist:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof Artist, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Add New Artist
              </div>
            </div>
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Add a new artist to your collection. Fill in the details below to get started.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-slate-700">
              Artist Name *
            </Label>
            <Input
              id="name"
              placeholder="Enter artist name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="border-slate-200 focus:border-violet-300 focus:ring-violet-200 bg-white/50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="genre" className="text-sm font-medium text-slate-700">
              Genre *
            </Label>
            <Input
              id="genre"
              placeholder="e.g., Pop, Rock, Jazz, Hip-Hop"
              value={formData.genre}
              onChange={(e) => handleChange("genre", e.target.value)}
              className="border-slate-200 focus:border-violet-300 focus:ring-violet-200 bg-white/50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image" className="text-sm font-medium text-slate-700">
              Image URL
            </Label>
            <div className="relative">
              <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                id="image"
                type="url"
                placeholder="https://example.com/artist-image.jpg"
                value={formData.image}
                onChange={(e) => handleChange("image", e.target.value)}
                className="pl-10 border-slate-200 focus:border-violet-300 focus:ring-violet-200 bg-white/50"
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
              className="bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 hover:from-violet-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg"
            >
              {isSubmitting ? "Adding..." : "Add Artist"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

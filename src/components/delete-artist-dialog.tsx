"use client"

import { useState } from "react"
import { Trash2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Artist {
  id: string
  name: string
  genre: string
  image: string
}

interface DeleteArtistDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  artist: Artist
  onDelete: (id: string) => Promise<void>
}

export function DeleteArtistDialog({ open, onOpenChange, artist, onDelete }: DeleteArtistDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete(artist.id)
    } catch (error) {
      console.error("Error deleting artist:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
              <Trash2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="bg-gradient-to-r from-red-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                Delete Artist
              </div>
            </div>
          </DialogTitle>
          <DialogDescription className="flex items-start gap-3 pt-2">
            <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="text-slate-600">
              Are you sure you want to delete <strong className="text-slate-900">{artist.name}</strong>? This action
              cannot be undone and will permanently remove the artist from your collection.
            </div>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="border-slate-200 hover:bg-slate-50"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 hover:from-red-600 hover:via-pink-600 hover:to-rose-600 text-white shadow-lg"
          >
            {isDeleting ? "Deleting..." : "Delete Artist"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

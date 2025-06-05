"use client"

import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DeleteConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  warningText?: string
  deleteUrl: string
  onDeleteSuccess: () => void
}

export default function DeleteConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  warningText,
  deleteUrl,
  onDeleteSuccess,
}: DeleteConfirmationDialogProps) {
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const response = await fetch(deleteUrl, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete record")
      }

      toast({
        title: "Success",
        description: "Record deleted successfully",
      })

      onOpenChange(false)
      onDeleteSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete record. Please try again.",
        variant: "destructive",
      })
      console.error("Error deleting record:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
          {warningText && (
            <div className="mt-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              <strong>Warning:</strong> {warningText}
            </div>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleDelete()
            }}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

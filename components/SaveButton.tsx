import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Save } from "lucide-react"

interface SaveButtonProps {
  question: string
  answer: string
  videoUrl: string
}

export function SaveButton({ question, answer, videoUrl }: SaveButtonProps) {
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/save-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer, videoUrl }),
      })
      if (!response.ok) throw new Error("Failed to save content")
      alert("Content saved successfully!")
    } catch (error) {
      console.error("Error saving content:", error)
      alert("Failed to save content. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Button onClick={handleSave} disabled={isSaving}>
      {isSaving ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <Save className="mr-2 h-4 w-4" />
          Save
        </>
      )}
    </Button>
  )
}


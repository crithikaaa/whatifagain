"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2 } from "lucide-react"
import { SaveButton } from "@/components/SaveButton"

export default function Home() {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setAnswer("")
    setVideoUrl("")
    setError("")

    try {
      // Generate text
      const textResponse = await fetch("/api/generate-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      })
      const textData = await textResponse.json()
      if (!textResponse.ok) throw new Error(textData.error || "Failed to generate text")
      setAnswer(textData.text)

      // Generate video
      const videoResponse = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: textData.text }),
      })
      const videoData = await videoResponse.json()
      if (!videoResponse.ok) throw new Error(videoData.error || "Failed to generate video")
      setVideoUrl(videoData.videoUrl)
    } catch (error) {
      console.error("Error:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8 text-center">What can I help you imagine today?</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md mb-8">
        <div className="flex flex-col items-center space-y-4">
          <Input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask your 'What If?' question..."
            className="w-full"
          />
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Imagining...
              </>
            ) : (
              "Imagine"
            )}
          </Button>
        </div>
      </form>
      {error && (
        <Alert variant="destructive" className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {answer && (
        <Card className="mt-8 w-full max-w-md">
          <CardHeader>
            <CardTitle>Here's what I imagined:</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">{answer}</p>
          </CardContent>
        </Card>
      )}
      {videoUrl && (
        <Card className="mt-8 w-full max-w-md">
          <CardHeader>
            <CardTitle>Visual representation:</CardTitle>
          </CardHeader>
          <CardContent>
            <video src={videoUrl} controls autoPlay loop muted className="w-full rounded-lg shadow-lg" />
          </CardContent>
        </Card>
      )}
      {answer && videoUrl && (
        <div className="mt-4">
          <SaveButton question={question} answer={answer} videoUrl={videoUrl} />
        </div>
      )}
    </main>
  )
}


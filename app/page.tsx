"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Home() {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setAnswer("")
    setVideoUrl("")

    console.log("Submitting question:", question)

    try {
      // Generate text
      console.log("Sending request to generate-text API")
      const textResponse = await fetch("/api/generate-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      })
      const textData = await textResponse.json()
      console.log("Received text response:", textData)
      setAnswer(textData.text)

      // Generate video
      console.log("Sending request to generate-video API")
      const videoResponse = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: textData.text }),
      })
      const videoData = await videoResponse.json()
      console.log("Received video response:", videoData)
      setVideoUrl(videoData.videoUrl)
    } catch (error) {
      console.error("Error:", error)
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
            placeholder="Ask your &apos;What If?&apos; question..."
            className="w-full"
          />
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Imagining..." : "Imagine"}
          </Button>
        </div>
      </form>
      {answer && (
        <div className="mt-8 w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4">Here&apos;s what I imagined:</h2>
          <p className="text-lg">{answer}</p>
        </div>
      )}
      {videoUrl && (
        <div className="mt-8 w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4">Visual representation:</h2>
          <video src={videoUrl} controls autoPlay loop muted className="w-full rounded-lg shadow-lg" />
        </div>
      )}
    </main>
  )
}


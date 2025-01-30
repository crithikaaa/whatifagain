"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { generateText, generateImage } from "../utils/huggingface"

export default function WhatIfUniverseBuilder() {
  const [prompt, setPrompt] = useState("")
  const [story, setStory] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const generatedStory = await generateText(
        `Create a short "What If" scenario based on the following prompt: ${prompt}`,
      )
      setStory(generatedStory)

      const imagePrompt = `Illustrate a scene from this story: ${generatedStory}`
      const generatedImageUrl = await generateImage(imagePrompt)
      setImageUrl(generatedImageUrl)
    } catch (error) {
      console.error("Error:", error)
      alert("An error occurred while generating the universe. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">What If Universe Builder</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <Input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your 'What If' scenario"
          className="mb-2"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Generating..." : "Generate Universe"}
        </Button>
      </form>

      {story && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Generated Story</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{story}</p>
          </CardContent>
        </Card>
      )}

      {imageUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Image</CardTitle>
          </CardHeader>
          <CardContent>
            <img src={imageUrl || "/placeholder.svg"} alt="Generated scene" className="w-full h-auto" />
          </CardContent>
        </Card>
      )}
    </div>
  )
}


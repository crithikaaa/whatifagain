import { NextResponse } from "next/server"
import { HfInference } from "@huggingface/inference"

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

export async function POST(req: Request) {
  console.log("generate-video API called")
  if (!process.env.HUGGINGFACE_API_KEY) {
    console.error("HUGGINGFACE_API_KEY is not set")
    return NextResponse.json({ error: "Hugging Face API key not configured" }, { status: 500 })
  }

  const { prompt } = await req.json()
  console.log("Received prompt:", prompt)

  if (!prompt || prompt.trim().length === 0) {
    console.error("Invalid prompt received")
    return NextResponse.json({ error: "Please provide a valid prompt" }, { status: 400 })
  }

  try {
    console.log("Calling Hugging Face API")
    const response = await hf.textToImage({
      inputs: prompt,
      model: "stabilityai/stable-diffusion-2",
    })
    console.log("Hugging Face API response received")

    const buffer = await response.arrayBuffer()
    const base64 = Buffer.from(buffer).toString("base64")
    const dataUrl = `data:image/jpeg;base64,${base64}`

    return NextResponse.json({ imageUrl: dataUrl })
  } catch (error) {
    console.error("Error in Hugging Face API call:", error)
    return NextResponse.json({ error: "An error occurred during image generation." }, { status: 500 })
  }
}


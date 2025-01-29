import { NextResponse } from "next/server"
import { HfInference } from "@huggingface/inference"

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

export async function POST(req: Request) {
  if (!process.env.HUGGINGFACE_API_KEY) {
    return NextResponse.json({ error: "Hugging Face API key not configured" }, { status: 500 })
  }

  const { prompt } = await req.json()

  if (!prompt || prompt.trim().length === 0) {
    return NextResponse.json({ error: "Please provide a valid prompt" }, { status: 400 })
  }

  try {
    const response = await hf.textToImage({
      inputs: prompt,
      model: "stabilityai/stable-diffusion-2",
    })

    // Convert the blob to a base64 string
    const buffer = await response.arrayBuffer()
    const base64 = Buffer.from(buffer).toString("base64")
    const dataUrl = `data:image/jpeg;base64,${base64}`

    return NextResponse.json({ imageUrl: dataUrl })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "An error occurred during video generation." }, { status: 500 })
  }
}


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
    console.log("Calling Hugging Face API with HunyuanVideo model")
    const response = await hf.textToVideo({
      inputs: prompt,
      model: "tencent/HunyuanVideo",
      parameters: {
        num_inference_steps: 50,
        guidance_scale: 7.5,
      },
    })
    console.log("Hunyuan Video API response received")

    // Convert the video data to a base64 string
    const buffer = await response.arrayBuffer()
    const base64 = Buffer.from(buffer).toString("base64")
    const dataUrl = `data:video/mp4;base64,${base64}`

    return NextResponse.json({ videoUrl: dataUrl })
  } catch (error) {
    console.error("Error in Hugging Face API call:", error)
    return NextResponse.json({ error: "An error occurred during video generation." }, { status: 500 })
  }
}


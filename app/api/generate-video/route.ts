import { NextResponse } from "next/server"
import { HfInference } from "@huggingface/inference"

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

export async function POST(req: Request) {
  console.log("generate-text API called")
  if (!process.env.HUGGINGFACE_API_KEY) {
    console.error("HUGGINGFACE_API_KEY is not set")
    return NextResponse.json({ error: "Hugging Face API key not configured" }, { status: 500 })
  }

  const { question } = await req.json()
  console.log("Processing question:", question)

  if (!question || question.trim().length === 0) {
    console.error("Invalid question received")
    return NextResponse.json({ error: "Please provide a valid question" }, { status: 400 })
  }

  try {
    console.log("Calling DeepSeek-R1 API...")
    const response = await hf.textGeneration({
      model: "deepseek-ai/DeepSeek-R1",
      inputs: `Explain the 'What If?' scenario in a creative and fun way: ${question}`,
      parameters: {
        max_new_tokens: 200,
        temperature: 0.7,
        top_p: 0.95,
        repetition_penalty: 1.15,
      },
    })
    console.log("DeepSeek-R1 API response received successfully")
    return NextResponse.json({ text: response.generated_text })
  } catch (error) {
    console.error("Error in DeepSeek-R1 API call:", error)
    return NextResponse.json({ error: "An error occurred during text generation." }, { status: 500 })
  }
}


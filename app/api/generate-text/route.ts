import OpenAI from "openai"
import { NextResponse } from "next/server"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 })
  }

  const { question } = await req.json()

  if (!question || question.trim().length === 0) {
    return NextResponse.json({ error: "Please provide a valid question" }, { status: 400 })
  }

  try {
    const completion = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: `Explain the 'What If?' scenario: ${question} in a creative and fun way.`,
      max_tokens: 200,
      temperature: 0.8,
    })

    return NextResponse.json({ text: completion.choices[0].text?.trim() })
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message)
    }
    return NextResponse.json({ error: "An error occurred during your request." }, { status: 500 })
  }
}


import OpenAI from "openai"
import { NextResponse } from "next/server"

console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY) // Remove this line before deploying

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  console.log("generate-text API called")
  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is not set")
    return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 })
  }

  const { question } = await req.json()
  console.log("Received question:", question)

  if (!question || question.trim().length === 0) {
    console.error("Invalid question received")
    return NextResponse.json({ error: "Please provide a valid question" }, { status: 400 })
  }

  try {
    console.log("Calling OpenAI API")
    const completion = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: `Explain the 'What If?' scenario: ${question} in a creative and fun way.`,
      max_tokens: 200,
      temperature: 0.8,
    })
    console.log("OpenAI API response received")
    return NextResponse.json({ text: completion.choices[0].text?.trim() })
  } catch (error) {
    console.error("Error in OpenAI API call:", error)
    return NextResponse.json({ error: "An error occurred during your request." }, { status: 500 })
  }
}


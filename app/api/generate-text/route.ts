import Configuration, { OpenAIApi } from "openai"
import { NextResponse } from "next/server"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export async function POST(req: Request) {
  if (!configuration.apiKey) {
    return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 })
  }

  const { question } = await req.json()

  if (!question || question.trim().length === 0) {
    return NextResponse.json({ error: "Please provide a valid question" }, { status: 400 })
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Explain the 'What If?' scenario: ${question} in a creative and fun way.`,
      max_tokens: 200,
      temperature: 0.8,
    })

    return NextResponse.json({ text: completion.data.choices[0].text?.trim() })
  } catch (error: any) {
    if (error.response) {
      console.error(error.response.status, error.response.data)
      return NextResponse.json({ error: error.response.data }, { status: error.response.status })
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`)
      return NextResponse.json({ error: "An error occurred during your request." }, { status: 500 })
    }
  }
}


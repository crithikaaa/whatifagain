import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

export async function POST(req: Request) {
  try {
    const { question, answer, videoUrl } = await req.json()

    const content = {
      question,
      answer,
      videoUrl,
      timestamp: new Date().toISOString(),
    }

    const filePath = path.join(process.cwd(), "saved-content.json")

    let savedContent = []
    try {
      const fileContent = await fs.readFile(filePath, "utf-8")
      savedContent = JSON.parse(fileContent)
    } catch (error) {
      // File doesn't exist or is empty, start with an empty array
    }

    savedContent.push(content)

    await fs.writeFile(filePath, JSON.stringify(savedContent, null, 2))

    return NextResponse.json({ message: "Content saved successfully" })
  } catch (error) {
    console.error("Error saving content:", error)
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 })
  }
}


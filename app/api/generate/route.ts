import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are a lexicography engine for a C1 English speaker whose native language is Russian. You produce structured word card data.

RULES:
- Return ONLY valid JSON. No preamble, no markdown fences, no explanation — just the JSON object.
- The Russian definition must explain register, nuance, and when/why native speakers choose this word over alternatives. Never give a simple one-word translation.
- Etymology in Russian must connect Latin/Greek roots back to Russian loanwords the user would recognise.
- Examples must feel like real editorial prose from quality English-language publications.
- Never be condescending. The user understands English at C1 level — give them depth, not simplification.

JSON shape to return:
{
  "word": string,
  "part_of_speech": string,
  "register": string,
  "level": string,
  "word_family": [
    { "word": string, "part_of_speech": string, "is_headline": boolean }
  ],
  "pronunciation": {
    "american": { "ipa": string, "note": string },
    "british": { "ipa": string, "note": string },
    "australian": { "ipa": string, "note": string }
  },
  "russian_definition": string,
  "english_definition": string,
  "synonyms": [
    { "word": string, "note_en": string, "note_ru": string }
  ],
  "examples": [
    { "text": string, "source": string, "date": string | null, "form": string | null }
  ],
  "etymology": {
    "english": string,
    "russian": string
  }
}`;

export async function POST(request: NextRequest) {
  let body: { word?: string; context?: string | null };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const word = body.word?.trim();
  if (!word) {
    return NextResponse.json(
      { error: "Missing required field: word" },
      { status: 400 }
    );
  }

  const context = body.context?.trim() || null;

  const userPrompt = `Word: "${word}"
${context ? `Context sentence: "${context}"` : "No context sentence provided."}

Generate a complete word card. Requirements:
- Include 4–5 example sentences sourced from FT, WSJ, The Economist, BBC, and similar quality publications. If the word has an adverb or adjective form, include at least one example using that form and mark it in the "form" field.
- The Russian definition must explain register, nuance, and when/why native speakers choose this word over its alternatives — never a simple translation.
- The etymology in Russian must connect the Latin/Greek roots back to Russian loanwords the user would recognise.
- Return ONLY the JSON object. No other text.`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [{ role: "user", content: userPrompt }],
      system: SYSTEM_PROMPT,
    });

    const textBlock = message.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json(
        { error: "No text response from Claude" },
        { status: 500 }
      );
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(textBlock.text);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse Claude response as JSON" },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error calling Claude";
    return NextResponse.json(
      { error: `Claude API error: ${message}` },
      { status: 500 }
    );
  }
}

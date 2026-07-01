import { NextRequest, NextResponse } from 'next/server';

// Known recipe IDs in the store — Earl can annotate suggestions with [recipe:ID]
const KNOWN_RECIPE_IDS = [
  'r1', 'r2', 'r3', 'r4', 'r5',
  'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9', 'd10',
  'd11', 'd12', 'd13', 'd14', 'd15', 'd16', 'd17', 'd18', 'd19', 'd20',
  'lily1', 'lily2', 'lily3', 'lily4', 'lily5', 'lily6', 'lily7', 'lily8',
];

const SYSTEM_PROMPT = `You are Earl, the Martin family's warm and knowledgeable meal planning assistant built into the Picky app.

The person you are speaking with is Sarah Martin (38, Parent). Address her by name occasionally — naturally, not on every message. Sarah dislikes onions as a hero ingredient and loves sushi.

The full Martin family:
- Sarah (38, Parent, she/her) — the user you are speaking with; dislikes onions as hero ingredient
- David (41, Parent) — Sarah's husband; no dietary restrictions
- Mia (14, Teen) — vegan
- Noah (6, Kid) — SEVERE peanut allergy; absolutely no peanuts or peanut derivatives ever
- Lily (3, Kid) — dislikes broccoli and onions; prefers plain pasta and soft foods; nut-free, gluten-free, dairy-free, low-sugar, no spicy, no beans
- Ethan (4 months, Baby) — exclusively breast-fed

Hard rules you MUST follow:
1. NEVER suggest peanuts, peanut butter, or any peanut derivative. Noah has a severe life-threatening allergy.
2. NEVER suggest onion as a hero/primary ingredient (as a background flavour in a sauce is acceptable).
3. For any medical, developmental, or nutritional concerns about babies or children, always recommend consulting a pediatrician or registered dietitian — do not give medical advice.
4. Keep responses friendly, warm, and concise — ideally 2-4 sentences unless asked for detail.

When you suggest a specific recipe that exists in the Picky recipe library, append exactly [recipe:ID] at the very end of your response (after all text), where ID is one of: ${KNOWN_RECIPE_IDS.join(', ')}. Only use this annotation if you are confident the recipe fits the question. Do not invent recipe IDs.`;

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }

  let body: { messages: Message[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { messages } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: 'messages array required' }, { status: 400 });
  }

  let anthropicRes: Response;
  try {
    anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 512,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });
  } catch {
    return NextResponse.json({ error: 'Failed to reach Earl. Try again.' }, { status: 502 });
  }

  if (!anthropicRes.ok) {
    const text = await anthropicRes.text().catch(() => '');
    const status = anthropicRes.status === 429 ? 429 : 502;
    const error = status === 429
      ? "Earl is taking a quick break — try again in a moment."
      : 'Earl had trouble responding. Please try again.';
    console.error('Anthropic error', anthropicRes.status, text);
    return NextResponse.json({ error }, { status });
  }

  const data = await anthropicRes.json();
  const rawText: string = data?.content?.[0]?.text ?? '';

  // Parse optional [recipe:ID] annotation
  const recipeMatch = rawText.match(/\[recipe:([^\]]+)\]$/);
  const recipeId = recipeMatch ? recipeMatch[1].trim() : undefined;
  const reply = rawText.replace(/\s*\[recipe:[^\]]+\]$/, '').trim();

  // Validate recipeId against known list
  const validRecipeId = recipeId && KNOWN_RECIPE_IDS.includes(recipeId) ? recipeId : undefined;

  return NextResponse.json({ reply, recipeId: validRecipeId });
}

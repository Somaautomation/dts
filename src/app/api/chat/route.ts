import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { prisma } from '@/lib/prisma';
import { chatMessageSchema } from '@/lib/validators';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { apiRateLimiter } from '@/lib/rate-limit';

const SYSTEM_PROMPT_EN = `You are the official AI assistant of D.T. Srinivas Connect — the platform of MLC D.T. Srinivas (South East Teachers Constituency, Karnataka).

Your role:
- Help citizens navigate the platform: membership, grievances, teacher services, events.
- Provide concise information about D.T. Srinivas's roles, achievements, and initiatives in Karnataka.
- Direct users to the appropriate forms (e.g., grievance, membership, teacher request).
- For sensitive legal, medical, or financial issues, advise contacting the office directly.

Style: warm, respectful, factual. Avoid political partisanship beyond stating D.T. Srinivas's official roles. Never invent statistics or quotes.

Key facts:
- Member of the Legislative Council (MLC), South East Teachers Constituency
- Chairman, Karnataka State OBC Department
- State President, Karnataka State Category-1 Castes Federation
- State President, Karnataka State Yadava Sangha
- Secretary, SEA Group of Institutions`;

const SYSTEM_PROMPT_KN = `${SYSTEM_PROMPT_EN}\n\nUser may speak Kannada. Respond in Kannada when they do.`;

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'anon';
  const { success } = await apiRateLimiter.limit(`chat:${ip}`);
  if (!success) return NextResponse.json({ error: 'Rate limit' }, { status: 429 });

  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id as string | undefined;
    const data = chatMessageSchema.parse(await req.json());

    let chatSession = data.sessionId
      ? await prisma.chatSession.findUnique({ where: { id: data.sessionId } })
      : null;
    if (!chatSession) {
      chatSession = await prisma.chatSession.create({ data: { userId, language: data.language } });
    }

    await prisma.chatMessage.create({
      data: { sessionId: chatSession.id, role: 'user', content: data.message },
    });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      // Fallback canned response when no AI key configured (free-tier graceful)
      const reply = data.language === 'kn'
        ? 'ನಮಸ್ಕಾರ! ಪ್ರಸ್ತುತ AI ಸಹಾಯಕ ಕಾನ್ಫಿಗರ್ ಆಗಿಲ್ಲ. ದಯವಿಟ್ಟು ನಮ್ಮ ಕಚೇರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ ಅಥವಾ ಸೂಕ್ತ ವಿಭಾಗಕ್ಕೆ ಭೇಟಿ ನೀಡಿ.'
        : "Hello! Our AI assistant isn't configured yet. Please use the relevant section (membership, grievance, teacher portal) or contact our office.";
      await prisma.chatMessage.create({ data: { sessionId: chatSession.id, role: 'assistant', content: reply } });
      return NextResponse.json({ sessionId: chatSession.id, reply });
    }

    const client = new OpenAI({ apiKey, baseURL: process.env.OPENAI_BASE_URL });
    const history = await prisma.chatMessage.findMany({
      where: { sessionId: chatSession.id },
      orderBy: { createdAt: 'asc' },
      take: 20,
    });

    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: data.language === 'kn' ? SYSTEM_PROMPT_KN : SYSTEM_PROMPT_EN },
        ...history.map((m) => ({ role: m.role as any, content: m.content })),
      ],
      temperature: 0.4,
      max_tokens: 600,
    });

    const reply = completion.choices[0]?.message?.content ?? 'I could not generate a response.';
    await prisma.chatMessage.create({ data: { sessionId: chatSession.id, role: 'assistant', content: reply } });

    return NextResponse.json({ sessionId: chatSession.id, reply });
  } catch (err: any) {
    console.error(err);
    if (err.issues) return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    return NextResponse.json({ error: 'Chat failed' }, { status: 500 });
  }
}

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { anthropic, buildPrompt } from "@/lib/claude";

export const maxDuration = 60;

export async function POST() {
  const enc = new TextEncoder();

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) {
    return Response.json({ error: "No profile found" }, { status: 404 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "ANTHROPIC_API_KEY is not set" }, { status: 500 });
  }

  const prompt = buildPrompt(profile);
  const userId = session.user.id;

  const stream = new ReadableStream({
    async start(controller) {
      // Send immediately so Vercel doesn't time out waiting for the first byte
      controller.enqueue(enc.encode(JSON.stringify({ status: "generating" }) + "\n"));

      try {
        const message = await anthropic.messages.create({
          model: "claude-sonnet-4-6",
          max_tokens: 8000,
          messages: [{ role: "user", content: prompt }],
        });

        const raw =
          message.content[0].type === "text" ? message.content[0].text : "";

        let planContent: unknown;
        try {
          planContent = JSON.parse(raw);
        } catch {
          const cleaned = raw.replace(/```json|```/g, "").trim();
          try {
            planContent = JSON.parse(cleaned);
          } catch {
            console.error("[generate-plan] JSON parse failed. Raw:", raw.slice(0, 500));
            controller.enqueue(enc.encode(JSON.stringify({ status: "error", error: "AI returned invalid JSON" }) + "\n"));
            controller.close();
            return;
          }
        }

        const planData = planContent as { plan_title: string };

        const plan = await prisma.plan.create({
          data: {
            userId,
            title: planData.plan_title,
            content: planContent as object,
            rawPrompt: prompt,
            isActive: true,
          },
        });

        await prisma.plan.updateMany({
          where: { userId, id: { not: plan.id } },
          data: { isActive: false },
        });

        controller.enqueue(enc.encode(JSON.stringify({ status: "done" }) + "\n"));
      } catch (err) {
        console.error("[generate-plan] error:", err);
        const error = err instanceof Error ? err.message : String(err);
        controller.enqueue(enc.encode(JSON.stringify({ status: "error", error }) + "\n"));
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/x-ndjson" },
  });
}

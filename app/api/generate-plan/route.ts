import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { anthropic, buildPrompt } from "@/lib/claude";

export const maxDuration = 60;

export async function POST() {
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

  const prompt = buildPrompt(profile);

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
    planContent = JSON.parse(cleaned);
  }

  const planData = planContent as { plan_title: string };

  const plan = await prisma.plan.create({
    data: {
      userId: session.user.id,
      title: planData.plan_title,
      content: planContent as object,
      rawPrompt: prompt,
      isActive: true,
    },
  });

  await prisma.plan.updateMany({
    where: { userId: session.user.id, id: { not: plan.id } },
    data: { isActive: false },
  });

  return Response.json({ plan });
}

import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });

  return Response.json({ profile });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json() as {
    age: number;
    heightCm: number;
    weightKg: number;
    gender?: string;
    fitnessGoal: string;
    experienceLevel: string;
    daysPerWeek: number;
    equipment: string;
    injuries: string[];
    activityLevel: string;
  };

  const profile = await prisma.profile.upsert({
    where: { userId: session.user.id },
    update: { ...body },
    create: { userId: session.user.id, ...body },
  });

  return Response.json({ profile });
}

// lib/checkAILimit.ts
import { db } from "./db";
import { checkUser } from "./checkUser";

const DAILY_LIMIT = 5; // 🔒 adjust as needed

export async function checkAndLogAIRequest(): Promise<{ allowed: boolean; reason?: string }> {
  const user = await checkUser();
  if (!user) return { allowed: false, reason: "User not authenticated" };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Count requests made today
  const requestCount = await db.aIRequest.count({
    where: {
      userId: user.clerkUserId,
      createdAt: { gte: today },
    },
  });

  if (requestCount >= DAILY_LIMIT) {
    return { allowed: false, reason: "Daily quota reached" };
  }

  // Log this request
  await db.aIRequest.create({
    data: { userId: user.clerkUserId }, //
  });

  return { allowed: true };
}

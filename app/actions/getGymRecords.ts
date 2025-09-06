'use server';
import { db } from '@/lib/db';
import { checkUser } from '@/lib/checkUser';

interface GymRecord {
  id: string;
  userId: string;
  workoutType: string;
  weight: number;
  date: Date;
}

async function getGymRecords(): Promise<{
  records?: { date: string; weight: number; workoutType: string }[];
  error?: string;
}> {
  try {
    const user = await checkUser(); // Use Prisma User
    if (!user) return { error: 'User not found' };
    const userId = user.id;

    const records: GymRecord[] = await db.gymRecord.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
    });

    const formattedRecords = records.map((record) => ({
      date: record.date.toISOString().split("T")[0],
      weight: record.weight,
      workoutType: record.workoutType,
    }));

    return { records: formattedRecords };
  } catch (error) {
    console.error('Error fetching gym records:', error);
    return { error: 'Database error' };
  }
}

export default getGymRecords;

export interface GymRecord {
  id: string;
  date: string | number | Date;  // workout date
  workoutType: string;           // e.g., "Chest", "Legs"
  weight: number;                // current body weight
  userId: string;
  createdAt: Date;
}

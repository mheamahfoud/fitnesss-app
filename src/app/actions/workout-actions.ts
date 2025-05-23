'use server';
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Type for workout input data
type WorkoutInput = {
  date: string; // ISO string, e.g., "2025-05-23T08:00:00.000Z"
  type: string;
  duration: number; // Duration in minutes
  notes?: string | null;
};

// Create a new workout
export async function createWorkout(data: WorkoutInput) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Unauthorized');

  // Validate input data
  if (!data.date || !data.type || !data.duration) {
    throw new Error('Date, type, and duration are required');
  }

  return prisma.workout.create({
    data: {
      userId: session.user.id,
      date: new Date(data.date),
      type: data.type,
      duration: data.duration,
      notes: data.notes || null,
    },
  });
}

// Get all workouts for a user
export async function getWorkouts() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Unauthorized');

  return prisma.workout.findMany({
    where: { userId: session.user.id },
    orderBy: { date: 'desc' },
  });
}

// Update an existing workout
export async function updateWorkout(workoutId: string, data: WorkoutInput) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Unauthorized');

  // Validate input data
  if (!data.date || !data.type || !data.duration) {
    throw new Error('Date, type, and duration are required');
  }

  const existingWorkout = await prisma.workout.findUnique({
    where: { id: parseInt(workoutId) },
  });

  if (!existingWorkout || existingWorkout.userId !== session.user.id) {
    throw new Error('Workout not found or unauthorized');
  }

  return prisma.workout.update({
    where: { id: parseInt(workoutId) },
    data: {
      date: new Date(data.date),
      type: data.type,
      duration: data.duration,
      notes: data.notes || null,
    },
  });
}

// Delete a workout
export async function deleteWorkout(workoutId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Unauthorized');

  const existingWorkout = await prisma.workout.findUnique({
    where: { id: parseInt(workoutId) },
  });

  if (!existingWorkout || existingWorkout.userId !== session.user.id) {
    throw new Error('Workout not found or unauthorized');
  }

  await prisma.workout.delete({
    where: { id: parseInt(workoutId) },
  });

  return { success: true };
}
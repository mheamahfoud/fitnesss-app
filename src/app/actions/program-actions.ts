'use server';
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Type for program input data
type ProgramInput = {
  title: string;
  description: string;
  is_free: boolean;
};

// Create a new trainer program
export async function createProgram(data: ProgramInput) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Unauthorized');

  // Validate input data
  if (!data.title || !data.description) {
    throw new Error('Title and description are required');
  }

  return prisma.trainerProgram.create({
    data: {
      trainerId: session.user.id,
      title: data.title,
      description: data.description,
      is_free: data.is_free,
    },
  });
}

// Get all programs for a trainer
export async function getTrainerPrograms(trainerId: number) {
  return prisma.trainerProgram.findMany({
    where: { trainerId: trainerId },
    include: {
      _count: {
        select: { userPrograms: true },
      },
    },
    orderBy: { id: 'desc' },
  });
}

// Update an existing trainer program
export async function updateProgram(programId: string, data: ProgramInput) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Unauthorized');

  // Validate input data
  if (!data.title || !data.description) {
    throw new Error('Title and description are required');
  }

  return prisma.trainerProgram.update({
    where: { id: parseInt(programId), trainerId: session.user.id },
    data: {
      title: data.title,
      description: data.description,
      is_free: data.is_free,
    },
  });
}

// Delete a trainer program
export async function deleteProgram(programId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Unauthorized');

  return prisma.trainerProgram.delete({
    where: { id: parseInt(programId), trainerId: session.user.id },
  });
}

// Get all programs with trainer names
export async function getAllPrograms() {
  return prisma.trainerProgram.findMany({
    include: {
      trainer: {
        select: { name: true },
      },
      userPrograms: {
        select: { userId: true },
      },
    },
    orderBy: { id: 'desc' },
  });
}

// Assign a user to a free program
export async function assignProgram(programId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Unauthorized');
  if (session.user.role !== 'user') throw new Error('Only users can assign programs');

  const program = await prisma.trainerProgram.findUnique({
    where: { id: parseInt(programId) },
  });

  if (!program) throw new Error('Program not found');
  if (!program.is_free) throw new Error('Only free programs can be assigned');

  // Check if the user is already assigned to the program
  const existingAssignment = await prisma.userProgram.findFirst({
    where: {
      userId:session.user.id,
      programId: parseInt(programId),
    },
  });

  if (existingAssignment) throw new Error('You are already assigned to this program');

  return prisma.userProgram.create({
    data: {
      userId: session.user.id,
      programId: parseInt(programId),
      start_date: new Date(),
      is_active: true,
    },
  });
}

// Get statistics for a user
export async function getUserStats() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'user') throw new Error('Unauthorized');

  const userId = session.user.id;

  // Total workouts
  const totalWorkouts = await prisma.workout.count({
    where: { userId },
  });

  // Total active programs
  const totalPrograms = await prisma.userProgram.count({
    where: { userId, is_active: true },
  });

  // Recent workout types (top 3)
  const recentWorkouts = await prisma.workout.groupBy({
    by: ['type'],
    where: { userId },
    _count: { type: true },
    orderBy: { _count: { type: 'desc' } },
    take: 3,
  });

  return {
    totalWorkouts,
    totalPrograms,
    recentWorkoutTypes: recentWorkouts.map((w) => ({
      type: w.type,
      count: w._count.type,
    })),
  };
}

// Get statistics for a trainer
export async function getTrainerStats() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'trainer') throw new Error('Unauthorized');

  const trainerId = session.user.id;

  // Total programs created
  const totalPrograms = await prisma.trainerProgram.count({
    where: { trainerId },
  });

  // Total users assigned to programs
  const totalUsers = await prisma.userProgram.count({
    where: { program: { trainerId } },
  });

  // Free vs paid program distribution
  const programDistribution = await prisma.trainerProgram.groupBy({
    by: ['is_free'],
    where: { trainerId },
    _count: { is_free: true },
  });

  return {
    totalPrograms,
    totalUsers,
    freePrograms: programDistribution.find((p) => p.is_free)?._count.is_free || 0,
    paidPrograms: programDistribution.find((p) => !p.is_free)?._count.is_free || 0,
  };
}
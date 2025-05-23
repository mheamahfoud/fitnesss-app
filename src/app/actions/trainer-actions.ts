'use server';
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// Type for program input data

// Type for trainer CV input data
type TrainerCVInput = {
  bio: string;
  experience: string;
  skills: string;
};


// Create or update a trainer's CV
export async function createOrUpdateTrainerCV(data: TrainerCVInput) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'trainer') throw new Error('Unauthorized');

  // Validate input data
  if (!data.experience || !data.skills) {
    throw new Error('Experience and skills are required');
  }

  const trainerId = session.user.id;

  // Check if CV already exists
  const existingCV = await prisma.trainerCV.findUnique({
    where: { trainerId },
  });

  if (existingCV) {
    return prisma.trainerCV.update({
      where: { trainerId },
      data: {
        bio: data.bio || null,
        experience: data.experience,
        skills: data.skills,
      },
    });
  }

  return prisma.trainerCV.create({
    data: {
      trainerId,
      bio: data.bio || null,
      experience: data.experience,
      skills: data.skills,
    },
  });
}

// Get a trainer's CV
export async function getTrainerCV(trainerId: number) {
  const cv = await prisma.trainerCV.findUnique({
    where: { trainerId: trainerId },
    include: { trainer: { select: { name: true, email: true } } },
  });
  return cv;
}

// Get all trainers' CVs
export async function getAllTrainerCVs() {
  return prisma.trainerCV.findMany({
    include: { trainer: { select: { name: true, email: true } } },
    orderBy: { updatedAt: 'desc' },
  });
}
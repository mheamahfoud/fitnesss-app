'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaDumbbell, FaUser } from 'react-icons/fa';
import LoadingSpinner from '@/components/loading-spinner';
import { getAllTrainerCVs } from '@/app/actions/trainer-actions';


type TrainerCV = {
  id: number;
  bio: string | null;
  experience: string;
  skills: string;
  trainer: { name: string; email: string };
};

export default function TrainerCVViewerPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cvs, setCVs] = useState<TrainerCV[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      if (session?.user?.role !== 'user') {
        setError('Unauthorized: Only users can access this page');
        setIsLoading(false);
      } else {
        fetchCVs();
      }
    }
  }, [status, session, router]);

  const fetchCVs = async () => {
    setIsLoading(true);
    try {
      const cvData = await getAllTrainerCVs();
      setCVs(cvData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2 mb-8">
          <FaDumbbell className="text-blue-600" />
          Meet Our Trainers
        </h1>

        {cvs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FaUser className="mx-auto text-5xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Trainer CVs Available</h3>
            <p className="text-gray-500">Check back later to explore our trainers’ profiles!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cvs.map((cv) => (
              <div
                key={cv.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white">
                    <FaUser size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{cv.trainer.name}</h2>
                    <p className="text-sm text-gray-500">{cv.trainer.email}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {cv.bio && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Bio</h3>
                      <p className="text-gray-600">{cv.bio}</p>
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Experience</h3>
                    <p className="text-gray-600 whitespace-pre-wrap">{cv.experience}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Skills</h3>
                    <p className="text-gray-600 whitespace-pre-wrap">{cv.skills}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FaDumbbell, FaPlus, FaCheck, FaTimes } from 'react-icons/fa';
import { FiType, FiUser, FiDollarSign } from 'react-icons/fi';
import { GiWeightLiftingUp } from 'react-icons/gi';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/loading-spinner';
import { getAllPrograms, assignProgram  } from '@/app/actions/program-actions';


type Program = {
  id: number;
  title: string;
  is_free: boolean;
  trainer: { name: string };
  userPrograms: { userId: number }[];
};

export default function UserProgramsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      if (session?.user?.role !== 'user') {
        setError('Unauthorized: Only users can access this page');
        setIsLoading(false);
      } else {
        fetchPrograms();
      }
    }
  }, [status, session, router]);

  const fetchPrograms = async () => {
    setIsLoading(true);
    try {
      const data = await getAllPrograms();
      setPrograms(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssign = async (program: Program) => {
    setSelectedProgram(program);
    setIsModalOpen(true);
  };

  const confirmAssign = async () => {
    if (!selectedProgram) return;
    setIsAssigning(true);

    try {
      await assignProgram(selectedProgram.id.toString());
      fetchPrograms(); // Refresh to update assignment status
      setIsModalOpen(false);
      setSelectedProgram(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsAssigning(false);
    }
  };

  const isAssigned = (program: Program) => {
    return program.userPrograms.some((up) => up.userId ===session?.user?.id);
  };

  if (isLoading && programs.length === 0) {
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
    <div className="py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <FaDumbbell className="text-blue-600" />
          Available Programs
        </h1>
      </div>

      {programs.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <GiWeightLiftingUp className="mx-auto text-5xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Programs Available</h3>
          <p className="text-gray-500 mb-4">Check back later for new fitness programs!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <div
              key={program.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <FiType className="text-blue-500" />
                    {program.title}
                  </h3>
                </div>

                <div className="space-y-3 mt-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiUser className="text-blue-500" />
                    <span>{program.trainer.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiDollarSign className="text-blue-500" />
                    <span>{program.is_free ? 'Free' : 'Paid'}</span>
                  </div>
                  {program.is_free && (
                    <div className="mt-4">
                      {isAssigned(program) ? (
                        <span className="text-green-600 font-semibold flex items-center gap-2">
                          <FaCheck /> Assigned
                        </span>
                      ) : (
                        <button
                          onClick={() => handleAssign(program)}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:opacity-90 transition"
                          disabled={isAssigning}
                        >
                          <FaPlus /> Assign Program
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assignment Confirmation Modal */}
      {isModalOpen && selectedProgram && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Assign Program</h3>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedProgram(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>

              <p className="text-gray-600 mb-6">
                Do you want to assign to the program <strong>{selectedProgram.title}</strong> by{' '}
                <strong>{selectedProgram.trainer.name}</strong>? This will add it to your active programs.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedProgram(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAssign}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:opacity-90"
                  disabled={isAssigning}
                >
                  {isAssigning ? (
                    <LoadingSpinner size="small" />
                  ) : (
                    <>
                      <FaCheck />
                      Assign
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
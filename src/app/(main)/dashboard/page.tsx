'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaDumbbell, FaChartPie, FaUsers, FaMoneyBillWave } from 'react-icons/fa';
import { FiActivity } from 'react-icons/fi';
import LoadingSpinner from '@/components/loading-spinner';
import { getUserStats, getTrainerStats  } from '@/app/actions/program-actions';

type UserStats = {
  totalWorkouts: number;
  totalPrograms: number;
  recentWorkoutTypes: { type: string; count: number }[];
};

type TrainerStats = {
  totalPrograms: number;
  totalUsers: number;
  freePrograms: number;
  paidPrograms: number;
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [trainerStats, setTrainerStats] = useState<TrainerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchStats();
    }
  }, [status, router]);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      if (session?.user?.role === 'user') {
        const stats = await getUserStats();
        setUserStats(stats);
      } else if (session?.user?.role === 'trainer') {
        const stats = await getTrainerStats();
        setTrainerStats(stats);
      }
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FaDumbbell className="text-blue-600" />
            Welcome, {session?.user?.name || session?.user?.email?.split('@')[0]}
          </h1>
          <span className="text-sm font-medium text-gray-500">
            Role: {session?.user?.role}
          </span>
        </div>

        {session?.user?.role === 'user' && userStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total Workouts Card */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white">
                  <FaDumbbell size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Total Workouts</h3>
                  <p className="text-2xl font-bold text-blue-600">{userStats.totalWorkouts}</p>
                  <p className="text-sm text-gray-500">Completed sessions</p>
                </div>
              </div>
            </div>

            {/* Total Programs Card */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white">
                  <FiActivity size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Active Programs</h3>
                  <p className="text-2xl font-bold text-blue-600">{userStats.totalPrograms}</p>
                  <p className="text-sm text-gray-500">Currently enrolled</p>
                </div>
              </div>
            </div>

            {/* Recent Workout Types Card */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white">
                  <FaChartPie size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Top Workout Types</h3>
                  {userStats.recentWorkoutTypes.length > 0 ? (
                    <ul className="mt-2 space-y-1">
                      {userStats.recentWorkoutTypes.map((wt) => (
                        <li key={wt.type} className="text-sm text-gray-600">
                          {wt.type}: <span className="font-semibold">{wt.count}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No workouts yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {session?.user?.role === 'trainer' && trainerStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total Programs Card */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white">
                  <FiActivity size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Programs Created</h3>
                  <p className="text-2xl font-bold text-blue-600">{trainerStats.totalPrograms}</p>
                  <p className="text-sm text-gray-500">Your training programs</p>
                </div>
              </div>
            </div>

            {/* Total Users Card */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white">
                  <FaUsers size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Users Enrolled</h3>
                  <p className="text-2xl font-bold text-blue-600">{trainerStats.totalUsers}</p>
                  <p className="text-sm text-gray-500">In your programs</p>
                </div>
              </div>
            </div>

            {/* Program Distribution Card */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white">
                  <FaMoneyBillWave size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Program Distribution</h3>
                  <p className="text-sm text-gray-600">
                    Free: <span className="font-semibold">{trainerStats.freePrograms}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Paid: <span className="font-semibold">{trainerStats.paidPrograms}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
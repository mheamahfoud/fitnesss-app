'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FaDumbbell, FaPlus, FaEdit, FaTrash, FaTimes, FaCheck } from 'react-icons/fa';
import { FiCalendar, FiClock, FiType } from 'react-icons/fi';
import { GiWeightLiftingUp } from 'react-icons/gi';
import { MdNotes } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/loading-spinner';
import { createWorkout, getWorkouts, updateWorkout, deleteWorkout } from '@/app/actions/workout-actions';

type Workout = {
  id: number;
  date: string;
  type: string;
  duration: number;
  notes: string | null;
};

type WorkoutFormData = {
  date: string;
  type: string;
  duration: number;
  notes: string;
};

export default function WorkoutsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState<number | null>(null);
  const [formData, setFormData] = useState<WorkoutFormData>({
    date: new Date().toISOString().slice(0, 16),
    type: '',
    duration: 30,
    notes: '',
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchWorkouts();
    }
  }, [status, router]);

  const fetchWorkouts = async () => {
    setIsLoading(true);
    try {
      const data = await getWorkouts();
      setWorkouts(
        data.map((workout) => ({
          ...workout,
          date: workout.date.toISOString(), // Convert Date to ISO string
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingId) {
        await updateWorkout(editingId.toString(), {
          date: formData.date,
          type: formData.type,
          duration: formData.duration,
          notes: formData.notes || null,
        });
      } else {
        await createWorkout({
          date: formData.date,
          type: formData.type,
          duration: formData.duration,
          notes: formData.notes || null,
        });
      }
      fetchWorkouts();
      resetForm();
      setIsModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (workout: Workout) => {
    setFormData({
      date: new Date(workout.date).toISOString().slice(0, 16),
      type: workout.type,
      duration: workout.duration,
      notes: workout.notes || '',
    });
    setEditingId(workout.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    setWorkoutToDelete(id);

    try {
      await deleteWorkout(id.toString());
      fetchWorkouts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsDeleting(false);
      setWorkoutToDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().slice(0, 16),
      type: '',
      duration: 30,
      notes: '',
    });
    setEditingId(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) || 0 : value,
    }));
  };

  const workoutTypes = [
    'Strength Training',
    'Cardio',
    'HIIT',
    'Yoga',
    'Pilates',
    'CrossFit',
    'Cycling',
    'Running',
    'Swimming',
    'Other',
  ];

  if (isLoading && workouts.length === 0) {
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
          My Workouts
        </h1>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          <FaPlus /> Add Workout
        </button>
      </div>

      {workouts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <GiWeightLiftingUp className="mx-auto text-5xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Workouts Recorded</h3>
          <p className="text-gray-500 mb-4">Start tracking your fitness journey by adding your first workout!</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
            <FaPlus /> Add Workout
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workouts.map((workout) => (
            <div
              key={workout.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <FiType className="text-blue-500" />
                    {workout.type}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(workout)}
                      className="text-blue-500 hover:text-blue-700 transition"
                      aria-label="Edit workout"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(workout.id)}
                      className="text-red-500 hover:text-red-700 transition"
                      aria-label="Delete workout"
                      disabled={isDeleting && workoutToDelete === workout.id}
                    >
                      {isDeleting && workoutToDelete === workout.id ? (
                        <LoadingSpinner size="small" />
                      ) : (
                        <FaTrash />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-3 mt-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiCalendar className="text-blue-500" />
                    <span>
                      {new Date(workout.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <FiClock className="text-blue-500" />
                    <span>{workout.duration} minutes</span>
                  </div>

                  {workout.notes && (
                    <div className="flex items-start gap-2 text-gray-600">
                      <MdNotes className="text-blue-500 mt-1" />
                      <p className="text-sm">{workout.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Workout Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {editingId ? 'Edit Workout' : 'Add New Workout'}
                </h3>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                      Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                      Workout Type
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select a type</option>
                      {workoutTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      id="duration"
                      name="duration"
                      min="1"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:opacity-90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <LoadingSpinner size="small" />
                    ) : (
                      <>
                        <FaCheck />
                        {editingId ? 'Update' : 'Save'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
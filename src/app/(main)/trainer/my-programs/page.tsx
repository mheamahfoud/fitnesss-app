'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FaDumbbell, FaPlus, FaEdit, FaTrash, FaTimes, FaCheck } from 'react-icons/fa';
import { FiType, FiInfo } from 'react-icons/fi';
import { GiWeightLiftingUp } from 'react-icons/gi';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/loading-spinner';
import { createProgram, getTrainerPrograms, updateProgram, deleteProgram  } from '@/app/actions/program-actions';


type Program = {
  id: number;
  title: string;
  description: string;
  is_free: boolean;
};

type ProgramFormData = {
  title: string;
  description: string;
  is_free: boolean;
};

export default function ProgramsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<number | null>(null);
  const [formData, setFormData] = useState<ProgramFormData>({
    title: '',
    description: '',
    is_free: false,
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      if (session?.user?.role !== 'trainer') {
        setError('Unauthorized: Only trainers can access this page');
        setIsLoading(false);
      } else {
        fetchPrograms();
      }
    }
  }, [status, session, router]);

  const fetchPrograms = async () => {
    setIsLoading(true);
    try {
      if(!session?.user?.id) return;
      const data = await getTrainerPrograms(session?.user?.id);
      setPrograms(data);
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
        await updateProgram(editingId.toString(), {
          title: formData.title,
          description: formData.description,
          is_free: formData.is_free,
        });
      } else {
        await createProgram({
          title: formData.title,
          description: formData.description,
          is_free: formData.is_free,
        });
      }
      fetchPrograms();
      resetForm();
      setIsModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (program: Program) => {
    setFormData({
      title: program.title,
      description: program.description,
      is_free: program.is_free,
    });
    setEditingId(program.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    setProgramToDelete(id);

    try {
      await deleteProgram(id.toString());
      fetchPrograms();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsDeleting(false);
      setProgramToDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      is_free: false,
    });
    setEditingId(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
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
          My Programs
        </h1>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          <FaPlus /> Add Program
        </button>
      </div>

      {programs.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <GiWeightLiftingUp className="mx-auto text-5xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Programs Created</h3>
          <p className="text-gray-500 mb-4">Start creating your fitness programs for users!</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
            <FaPlus /> Add Program
          </button>
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
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(program)}
                      className="text-blue-500 hover:text-blue-700 transition"
                      aria-label="Edit program"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(program.id)}
                      className="text-red-500 hover:text-red-700 transition"
                      aria-label="Delete program"
                      disabled={isDeleting && programToDelete === program.id}
                    >
                      {isDeleting && programToDelete === program.id ? (
                        <LoadingSpinner size="small" />
                      ) : (
                        <FaTrash />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-3 mt-4">
                  <div className="flex items-start gap-2 text-gray-600">
                    <FiInfo className="text-blue-500 mt-1" />
                    <p className="text-sm">{program.description}</p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaCheck className="text-blue-500" />
                    <span>{program.is_free ? 'Free' : 'Paid'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Program Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {editingId ? 'Edit Program' : 'Add New Program'}
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
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="is_free" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <input
                        type="checkbox"
                        id="is_free"
                        name="is_free"
                        checked={formData.is_free}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      Free Program
                    </label>
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
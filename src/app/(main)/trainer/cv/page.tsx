'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaDumbbell, FaCheck, FaTimes, FaUser } from 'react-icons/fa';
import { FiEdit } from 'react-icons/fi';
import LoadingSpinner from '@/components/loading-spinner';
import { createOrUpdateTrainerCV, getTrainerCV } from '@/app/actions/trainer-actions';


type TrainerCV = {
    bio: string | null;
    experience: string;
    skills: string;
    trainer: { name: string; email: string };
};

type FormData = {
    bio: string;
    experience: string;
    skills: string;
};

export default function TrainerCVPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [cv, setCV] = useState<TrainerCV | null>(null);
    const [formData, setFormData] = useState<FormData>({
        bio: '',
        experience: '',
        skills: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            if (session?.user?.role !== 'trainer') {
                setError('Unauthorized: Only trainers can access this page');
                setIsLoading(false);
            } else {
                fetchCV();
            }
        }
    }, [status, session, router]);

    const fetchCV = async () => {
        setIsLoading(true);
        try {
            if (!session?.user?.id) return;
            const cvData = await getTrainerCV(session?.user?.id);
            setCV(cvData);
            if (cvData) {
                setFormData({
                    bio: cvData.bio || '',
                    experience: cvData.experience,
                    skills: cvData.skills,
                });
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            await createOrUpdateTrainerCV(formData);
            await fetchCV();
            setIsEditing(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <FaDumbbell className="text-blue-600" />
                        Your CV
                    </h1>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:opacity-90 transition"
                        >
                            <FiEdit />
                            Edit CV
                        </button>
                    )}
                </div>

                {isEditing ? (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                                        Bio (Optional)
                                    </label>
                                    <textarea
                                        id="bio"
                                        name="bio"
                                        rows={4}
                                        value={formData.bio}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Tell us about yourself..."
                                    />
                                </div>

                                <div>
                                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                                        Experience
                                    </label>
                                    <textarea
                                        id="experience"
                                        name="experience"
                                        rows={4}
                                        value={formData.experience}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="List your professional experience..."
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                                        Skills
                                    </label>
                                    <textarea
                                        id="skills"
                                        name="skills"
                                        rows={4}
                                        value={formData.skills}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="List your skills (e.g., Strength Training, Yoga, Nutrition)"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:opacity-90"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? <LoadingSpinner size="small" /> : <FaCheck />}
                                    Save CV
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white">
                                <FaUser size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">{cv?.trainer.name}</h2>
                                <p className="text-sm text-gray-500">{cv?.trainer.email}</p>
                            </div>
                        </div>

                        {cv ? (
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
                        ) : (
                            <p className="text-gray-500 text-center">No CV created yet. Click Edit CV to add your details.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
'use client';
import { FiEdit, FiTrash2, FiUsers, FiCalendar } from "react-icons/fi";

export default function ProgramCard({
  program,
  onEdit,
  onDelete,
}: {
  program: any;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">{program.title}</h3>
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="text-blue-600 hover:text-blue-800"
              aria-label="Edit program"
            >
              <FiEdit />
            </button>
            <button
              onClick={onDelete}
              className="text-red-600 hover:text-red-800"
              aria-label="Delete program"
            >
              <FiTrash2 />
            </button>
          </div>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">{program.description}</p>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <FiCalendar />
            <span>{program.duration} weeks</span>
          </div>
          <div className="flex items-center gap-1">
            <FiUsers />
            <span>{program._count?.subscribers || 0} clients</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className={`px-3 py-1 rounded-full text-sm ${
            program.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
            program.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {program.difficulty}
          </span>
        </div>
      </div>
    </div>
  );
}
import Link from "next/link";
import { FaDumbbell, FaHeartbeat } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Fitness-themed header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
          <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
            <FaHeartbeat className="text-red-300" />
            FITTRACK
            <FaDumbbell className="text-yellow-300" />
          </h1>
        </div>

        <div className="p-8">
          <div className="text-8xl font-bold text-gray-800 mb-4">404</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h2>
          <p className="text-gray-600 mb-6">
            The page you are looking for is under construction and will be ready soon!
          </p>
          
          {/* Fitness illustration */}
          <div className="relative h-40 mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="w-24 h-24 bg-blue-100 rounded-full animate-pulse"></div>
                <FaDumbbell className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600 text-4xl animate-bounce" />
              </div>
            </div>
          </div>

          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>

      <p className="mt-8 text-gray-500 text-sm">
        Our team is working hard to build this feature. Check back soon!
      </p>
    </div>
  );
}
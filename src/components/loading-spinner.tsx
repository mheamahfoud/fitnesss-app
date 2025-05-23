import { FaSpinner } from 'react-icons/fa';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

export default function LoadingSpinner({ size = 'medium' }: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'text-base',
    medium: 'text-2xl',
    large: 'text-4xl'
  };

  return (
    <div className="flex justify-center items-center">
      <FaSpinner className={`animate-spin ${sizeClasses[size]} text-blue-600`} />
    </div>
  );
}
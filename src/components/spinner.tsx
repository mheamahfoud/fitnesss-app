'use client';
import { FaDumbbell } from "react-icons/fa";

export function Spinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className="flex justify-center items-center">
      <FaDumbbell
        className={`${sizeClasses[size]} text-blue-600 animate-spin`}
        style={{ animationDuration: "1.5s" }}
      />
    </div>
  );
}
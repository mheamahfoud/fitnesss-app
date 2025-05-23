import { Spinner } from "@/components/spinner";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
      <div className="text-center">
        <Spinner size="lg" />
      </div>
    </div>
  );
}
"use client";

// JanSetu AI - Error Boundary for Citizen Grievance Tracking
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error in Citizen Grievance Tracking:", error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] items-center justify-center p-6">
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center max-w-md">
        <h2 className="text-lg font-bold text-rose-900">Something went wrong</h2>
        <p className="mt-2 text-xs text-rose-700">{error.message || "An unexpected error occurred in Citizen Grievance Tracking."}</p>
        <button
          onClick={() => reset()}
          className="mt-4 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

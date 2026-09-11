// JanSetu AI - Loading State for Citizen Grievance Tracking
export default function Loading() {
  return (
    <div className="flex min-h-[400px] items-center justify-center p-6">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        <p className="text-sm font-medium text-slate-600">Loading Citizen Grievance Tracking...</p>
      </div>
    </div>
  );
}

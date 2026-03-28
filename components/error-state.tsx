"use client";

type ErrorStateProps = {
  message: string;
  onRetry: () => void;
};

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="mt-6 w-full rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800">
      <p className="text-base">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 h-12 rounded-xl bg-red-600 px-5 text-sm font-semibold text-white hover:bg-red-500"
      >
        다시 시도
      </button>
    </div>
  );
}

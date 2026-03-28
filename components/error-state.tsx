"use client";

type ErrorStateProps = {
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <section
      className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700"
      role="alert"
      aria-live="assertive"
    >
      <p className="text-sm font-medium">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 h-11 w-full rounded-xl bg-red-600 text-sm font-semibold text-white transition hover:bg-red-500"
        >
          다시 시도
        </button>
      )}
    </section>
  );
}

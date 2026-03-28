"use client";

type ErrorStateProps = {
  message: string;
  onRetry: () => void;
};

function getErrorHint(message: string) {
  if (message.includes("OPENAI_API_KEY")) {
    return "서버 환경변수 설정을 확인해 주세요. (Vercel Production)";
  }
  if (message.includes("OpenAI request failure")) {
    return "OpenAI API 호출이 실패했습니다. 잠시 후 다시 시도해 주세요.";
  }
  if (message.includes("invalid JSON/schema")) {
    return "모델 응답 포맷이 요구 스키마와 맞지 않았습니다. 재시도해 주세요.";
  }
  if (message.includes("HTTP")) {
    return "서버가 요청을 처리하지 못했습니다. 네트워크/서버 상태를 확인해 주세요.";
  }
  return "문제가 계속되면 잠시 후 다시 시도해 주세요.";
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const hint = getErrorHint(message);

  return (
    <div className="mt-6 w-full rounded-2xl border border-red-200 bg-red-50 p-5 text-red-900">
      <p className="text-sm font-semibold">문제가 발생했습니다.</p>
      <p className="mt-1 text-base break-words">{message}</p>
      <p className="mt-2 text-sm text-red-800/90">힌트: {hint}</p>
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

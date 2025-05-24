interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="glass rounded-3xl p-8 text-white text-center max-w-md mx-auto">
      <div className="text-6xl mb-4">⚠️</div>
      <h3 className="text-xl font-medium mb-2">Oops! Something went wrong</h3>
      <p className="text-white/60 mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-2xl transition-all duration-200 backdrop-blur-md border border-white/20"
        >
          Try Again
        </button>
      )}
    </div>
  );
} 
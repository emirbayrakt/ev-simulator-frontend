import { useEffect } from 'react';

export default function Toast({
  message,
  type = 'success',
  onClose,
}: {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bg = type === 'success' ? 'bg-emerald-600' : 'bg-red-600';

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <div
        className={`rounded text-white px-4 py-2 shadow-md animate-fade-in-up ${bg}`}
      >
        {message}
      </div>
    </div>
  );
}

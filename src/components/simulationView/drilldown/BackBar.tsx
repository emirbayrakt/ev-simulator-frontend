import { ArrowLeft } from 'lucide-react';

type Props = {
  title: string;
  subtitle?: string;
  onBack: () => void;
};

export default function BackBar({ title, subtitle, onBack }: Props) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center rounded-md border px-2 py-1 text-sm hover:bg-gray-50"
          title="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <div className="text-sm font-semibold">{title}</div>
          {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
        </div>
      </div>
    </div>
  );
}

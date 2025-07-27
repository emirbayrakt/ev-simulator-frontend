type Props = {
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
};

const colors: Record<Props['status'], string> = {
  queued: 'bg-blue-100 text-blue-800',
  running: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-700',
};

export default function StatusBadge({ status }: Props) {
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${colors[status]}`}
    >
      {status}
    </span>
  );
}

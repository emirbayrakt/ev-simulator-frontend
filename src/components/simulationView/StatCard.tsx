import React from 'react';

export default function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4  transition hover:shadow-md">
      <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-purple-100 text-purple-600">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-medium text-gray-500">{label}</span>
        <span className="text-[15px] font-semibold text-gray-800">{value}</span>
      </div>
    </div>
  );
}

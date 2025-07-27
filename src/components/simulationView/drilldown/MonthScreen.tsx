import { DateTime } from 'luxon';
import MonthHeatmap from './heatmaps/MonthHeatmap';

type MonthRow = {
  periodStart: string;
  periodEnd: string;
  energyKwh: number;
  eventsCount: number;
  max15mPowerKw: number;
};

type Props = {
  months: MonthRow[];
  selectedMonth: string | null;
  onSelectMonth: (_iso: string) => void;
};

export default function MonthScreen({
  months,
  selectedMonth,
  onSelectMonth,
}: Props) {
  return (
    <div className="space-y-4 relative">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold">Energy / Peak — Months</h2>
        {selectedMonth && (
          <span className="hidden sm:block text-xs text-gray-500">
            Selected: {DateTime.fromISO(selectedMonth).toFormat('LLLL ')}
          </span>
        )}
      </div>
      <MonthHeatmap
        rows={months}
        onSelectMonth={onSelectMonth}
        selected={selectedMonth}
        metric="energy"
      />
    </div>
  );
}

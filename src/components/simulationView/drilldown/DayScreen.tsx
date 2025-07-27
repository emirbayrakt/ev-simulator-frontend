import BackBar from './BackBar';
import DayHeatmap from './heatmaps/DayHeatmap';
import { DateTime } from 'luxon';

type Props = {
  monthIso: string; // ISO date of the month
  dailyRowsForMonth: any[]; // Rows for the selected month
  selectedDay: string | null; // Selected day ISO date
  onSelectDay: (_isoDate: string) => void; // Callback when a day is selected
  onBack: () => void; // Callback for back navigation
};

export default function DayScreen({
  monthIso,
  dailyRowsForMonth,
  selectedDay,
  onSelectDay,
  onBack,
}: Props) {
  return (
    <div className="space-y-4 relative">
      <BackBar
        title="Days"
        subtitle={DateTime.fromISO(monthIso).toFormat('LLLL ')}
        onBack={onBack}
      />
      <DayHeatmap
        rows={dailyRowsForMonth}
        onSelectDay={onSelectDay}
        selected={selectedDay}
        metric="peak"
      />
    </div>
  );
}

import { DateTime } from 'luxon';
import HeatMapTitle from './HeatMapTitle';

type HourRow = {
  id: string;
  hourStart: string; // ISO
  energyKwh: number;
  avgPowerKw: number;
  max15mPowerKw: number;
  max15mMinute: number;
  eventsCount: number;
};

type Props = {
  rows: HourRow[]; // 0–24 rows for the selected date
  onSelectHour: (_hourStartIso: string) => void;
  selectedHour?: string | null;
  metric?: 'energy' | 'peak'; // which metric drives the color
};

function valueForMetric(r: HourRow, metric: 'energy' | 'peak') {
  return metric === 'peak' ? r.max15mPowerKw : r.energyKwh;
}

export default function HourlyHeatmap({
  rows,
  onSelectHour,
  selectedHour,
  metric = 'peak',
}: Props) {
  const maxVal = rows.length
    ? Math.max(...rows.map((r) => valueForMetric(r, metric)))
    : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <HeatMapTitle title={'Hourly Heatmap'} />
        <div className="hidden sm:block  text-xs text-gray-500">
          Metric: {metric === 'peak' ? 'Peak kW (15m)' : 'Energy kWh'}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-5 gap-1">
        {rows.map((r) => {
          const hour = DateTime.fromISO(r.hourStart).toLocal().hour;
          const v = valueForMetric(r, metric);
          const ratio = maxVal > 0 ? v / maxVal : 0;
          // color scale: light → strong (HSL green)
          const bg = `hsl(175deg 70% ${95 - Math.round(55 * ratio)}%)`;
          const isSelected =
            selectedHour &&
            DateTime.fromISO(selectedHour).toUTC().toISO() ===
              DateTime.fromISO(r.hourStart).toUTC().toISO();

          return (
            <button
              key={r.id}
              onClick={() => onSelectHour(r.hourStart)}
              className={`relative aspect-square rounded-md border text-xs flex flex-col items-center justify-center hover:ring-1 hover:ring-blue-400 ${
                isSelected
                  ? 'ring-1 ring-blue-600 border-emebluerald-600'
                  : 'border-gray-200'
              }`}
              style={{ backgroundColor: bg }}
              title={`${hour.toString().padStart(2, '0')}:00 • ${metric === 'peak' ? `${r.max15mPowerKw.toFixed(1)} kW` : `${r.energyKwh.toFixed(1)} kWh`}`}
            >
              <div className="text-[13px] font-medium text-gray-900">
                {hour}:00{' '}
              </div>
              <div className="text-[12px] lg:text-[10px] xl:text-[12px] text-gray-700">
                Peak: {r.max15mPowerKw.toFixed(1)} kW
              </div>
              <div className="text-[12px] lg:text-[10px] xl:text-[12px] text-gray-700">
                Energy: {r.energyKwh.toFixed(0)} kWh
              </div>
              <div className="text-[12px] lg:text-[10px] xl:text-[12px] text-gray-700">
                Charges: {r.eventsCount}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

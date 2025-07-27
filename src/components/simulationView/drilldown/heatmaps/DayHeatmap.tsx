import { DateTime } from 'luxon';
import HeatMapTitle from './HeatMapTitle';

type Row = {
  periodStart: string; // ISO date (UTC)
  energyKwh: number;
  max15mPowerKw: number;
  eventsCount: number;
};

type Props = {
  rows: Row[]; // 28–31 rows (filtered to month)
  onSelectDay: (_isoDate: string) => void;
  selected?: string | null;
  metric?: 'energy' | 'peak';
};

function v(r: Row, m: 'energy' | 'peak') {
  return m === 'peak' ? r.max15mPowerKw : r.energyKwh;
}

export default function DayHeatmap({
  rows,
  onSelectDay,
  selected,
  metric = 'energy',
}: Props) {
  const maxVal = rows.length ? Math.max(...rows.map((r) => v(r, metric))) : 0;
  const getBg = (r: Row) => {
    const ratio = maxVal > 0 ? v(r, metric) / maxVal : 0;
    return `hsl(145deg 60% ${95 - Math.round(55 * ratio)}%)`; // green scale
  };

  return (
    <div className="space-y-1">
      <HeatMapTitle title={'Daily Heatmap'} />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-4 gap-1">
        {rows.map((r) => {
          const dt = DateTime.fromISO(r.periodStart).toLocal();
          const key = r.periodStart;
          const chosen = selected === key;
          return (
            <button
              key={key}
              onClick={() => onSelectDay(key)}
              className={`relative aspect-square rounded-md border text-xs flex flex-col items-center justify-center hover:ring-1 hover:ring-emerald-400 hover:opacity-90 ${
                chosen
                  ? 'ring-1 ring-emerald-600 border-emerald-600'
                  : 'border-gray-200'
              }`}
              style={{ backgroundColor: getBg(r) }}
              title={`${dt.toISODate()} • ${metric === 'peak' ? `${r.max15mPowerKw.toFixed(1)} kW` : `${r.energyKwh.toFixed(0)} kWh`}`}
            >
              <div className="text-[13px] font-medium text-gray-900">
                {dt.toFormat('dd LLL')}
              </div>
              <div className="text-[12px] text-gray-600">
                Peak: {r.max15mPowerKw.toFixed(1)} kW
              </div>
              <div className="text-[12px] text-gray-600">
                Energy: {r.energyKwh.toFixed(0)} kWh
              </div>
              <div className="text-[12px] text-gray-600">
                Charges: {r.eventsCount}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

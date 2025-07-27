import { DateTime } from 'luxon';
import HeatMapTitle from './HeatMapTitle';

type Row = {
  periodStart: string; // ISO date – first day of month UTC
  energyKwh: number;
  max15mPowerKw: number;
  eventsCount: number;
};

type Props = {
  rows: Row[]; // 12 rows
  onSelectMonth: (_isoFirstDay: string) => void;
  selected?: string | null;
  metric?: 'energy' | 'peak';
};

function v(row: Row, metric: 'energy' | 'peak') {
  return metric === 'peak' ? row.max15mPowerKw : row.energyKwh;
}

export default function MonthHeatmap({
  rows,
  onSelectMonth,
  selected,
  metric = 'energy',
}: Props) {
  const maxVal = rows.length ? Math.max(...rows.map((r) => v(r, metric))) : 0;
  const getBg = (r: Row) => {
    const ratio = maxVal > 0 ? v(r, metric) / maxVal : 0;
    return `hsl(270deg 99% ${89 - Math.round(55 * ratio)}%)`; // blue scale
  };

  return (
    <div className="space-y-1">
      <HeatMapTitle title={'Monthly Heatmap'} />
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-3 gap-2">
        {rows.map((r) => {
          const dt = DateTime.fromISO(r.periodStart).toLocal();
          const key = r.periodStart;
          const chosen = selected === key;
          return (
            <button
              key={key}
              onClick={() => onSelectMonth(key)}
              className={`relative aspect-square rounded-md border p-1 text-[15px] leading-tight flex flex-col items-center justify-center hover:ring-1 hover:ring-gray-400 hover:opacity-90 ${
                chosen
                  ? 'ring-1 ring-gray-600 border-gray-600'
                  : 'border-gray-200'
              }`}
              style={{ backgroundColor: getBg(r) }}
              title={`${dt.toFormat('LLLL')} • ${
                metric === 'peak'
                  ? `${r.max15mPowerKw.toFixed(1)} kW`
                  : `${r.energyKwh.toFixed(0)} kWh`
              } • ${r.eventsCount} events`}
            >
              <div className="text-[15px] font-medium text-white">
                {dt.toFormat('LLLL')}
              </div>
              <div className="text-[13px] text-white">
                Peak: {r.max15mPowerKw.toFixed(1)} kW
              </div>
              <div className="text-[13px] text-white">
                Energy: {r.energyKwh.toFixed(0)} kWh
              </div>
              <div className="text-[13px] text-white">
                Charges: {r.eventsCount}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

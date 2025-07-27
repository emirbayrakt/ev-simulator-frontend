import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { DateTime } from 'luxon';
import { useMemo, useState } from 'react';

type Props = {
  data: {
    date: string;
    energyKwh: number;
    powerKw: number;
    occupied: boolean;
  }[];
  title?: string;
  metric?: 'energy' | 'peak';
};

const MONTHS = Array.from({ length: 12 }, (_, i) =>
  DateTime.fromObject({ month: i + 1 }).toFormat('MM'),
);

export default function CpDailyChart({
  data,
  title = 'Chargepoint Daily Trend',
  metric = 'energy',
}: Props) {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const isEnergy = metric === 'energy';

  // Filter data for selected month
  const filteredData = useMemo(() => {
    if (!selectedMonth) return data;
    return data.filter(
      (d) => DateTime.fromISO(d.date).toFormat('MM') === selectedMonth,
    );
  }, [data, selectedMonth]);

  return (
    <div className="rounded-lg border border-gray-100 bg-[#fbfbfb] p-4 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-y-2 justify-between">
        <h3 className="text-sm font-semibold">{title}</h3>
        <select
          value={selectedMonth ?? ''}
          onChange={(e) => setSelectedMonth(e.target.value || null)}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
        >
          <option value="">All months</option>
          {MONTHS.map((month) => (
            <option key={month} value={month}>
              {DateTime.fromFormat(month, 'MM').toFormat('LLLL')}
            </option>
          ))}
        </select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            fontSize={10}
            tickFormatter={(dateStr) =>
              DateTime.fromISO(dateStr).toFormat('dd LLL')
            }
          />
          <YAxis
            yAxisId="left"
            label={{
              value: isEnergy ? 'kWh' : 'kW',
              angle: -90,
              position: 'insideLeft',
            }}
          />
          <Tooltip
            formatter={(value: number) =>
              `${value.toFixed(2)} ${isEnergy ? 'kWh' : 'kW'}`
            }
            labelFormatter={(label: string) =>
              DateTime.fromISO(label).toFormat('MMM dd')
            }
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey={isEnergy ? 'energyKwh' : 'powerKw'}
            stroke={isEnergy ? '#9810fa' : '#22c55e'}
            dot={false}
            name={isEnergy ? 'Energy (kWh)' : 'Avg Power (kW)'}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

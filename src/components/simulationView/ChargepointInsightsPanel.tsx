import { useQuery } from '@apollo/client';
import { useState } from 'react';
import { SIMULATION_CP_DAILY_SERIES } from '../../graphql/queries';
import CpDailyChart from './CpDailyChart';

type Props = {
  simulationId: string;
  chargepointCount: number;
};

export default function ChargepointInsightsPanel({
  simulationId,
  chargepointCount,
}: Props) {
  const [cpIndex, setCpIndex] = useState<number>(0);
  const [metric, setMetric] = useState<'energy' | 'peak'>('energy');

  const { data, loading, error } = useQuery(SIMULATION_CP_DAILY_SERIES, {
    variables: { simulationId, cpIndex },
  });

  const series = data?.simulationChargepointDailySeries ?? [];

  return (
    <div className="space-y-4 mt-6 rounded-xl border-gray-200 border  p-6">
      <h3 className="text-lg font-semibold">Chargepoint Graph</h3>
      <div className="flex items-center flex-wrap gap-y-2 gap-x-2 sm:gap-x-0 ">
        <div className="flex items-center gap-2">
          <label className="block xl:hidden text-sm font-medium text-gray-600">
            Select CP:
          </label>
          <label className="hidden xl:block text-sm font-medium text-gray-600">
            Select Chargepoint:
          </label>
          <select
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
            value={cpIndex}
            onChange={(e) => setCpIndex(Number(e.target.value))}
          >
            {Array.from({ length: chargepointCount }, (_, i) => (
              <option key={i} value={i}>
                CP #{i + 1}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center sm:ml-4">
          <label className="text-sm font-medium text-gray-600 mr-2">
            Metric:
          </label>
          <select
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
            value={metric}
            onChange={(e) => setMetric(e.target.value as 'energy' | 'peak')}
          >
            <option value="energy">Energy (kWh)</option>
            <option value="peak">Peak Power (kW)</option>
          </select>
        </div>
      </div>

      {/* Chart area with height preservation */}
      <div style={{ minHeight: 350 }}>
        {loading ? (
          <div className="w-full h-[350px] rounded-md bg-gray-100 animate-pulse relative overflow-hidden">
            <div className="absolute top-4 left-4 h-4 w-1/4 bg-gray-200 rounded" />
            <div className="absolute top-10 left-4 h-4 w-3/4 bg-gray-200 rounded" />
            <div className="absolute bottom-6 left-4 right-4 h-2 bg-gray-200 rounded" />
            <div className="absolute bottom-4 left-4 right-4 h-2 bg-gray-200 rounded" />
          </div>
        ) : error ? (
          <p className="text-sm text-red-600">Error: {error.message}</p>
        ) : (
          <CpDailyChart
            data={series}
            metric={metric}
            title={`Chargepoint #${cpIndex + 1} (${metric === 'energy' ? 'kWh' : 'kW'})`}
          />
        )}
      </div>
    </div>
  );
}

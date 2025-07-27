import { Bolt, Gauge, Clock, Cpu, ThermometerSnowflake } from 'lucide-react';
import StatCard from './StatCard';

function safeFixed(val: unknown, digits = 0, unit = '') {
  return typeof val === 'number'
    ? `${val.toFixed(digits)}${unit ? ` ${unit}` : ''}`
    : '-';
}

export default function YearSummary({ sim }: { sim: any }) {
  const summary = sim.summary;

  return (
    <div className="rounded-xl border-gray-200 border  p-6 space-y-4 ">
      <h3 className="text-lg font-semibold">Yearly Summary</h3>

      {summary ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <StatCard
            icon={Gauge}
            label="Theor. Max"
            value={safeFixed(summary.theoreticalMaxKw, 0, 'kW')}
          />
          <StatCard
            icon={Gauge}
            label="Peak Power"
            value={safeFixed(summary.actualPeakKw, 1, 'kW')}
          />
          <StatCard
            icon={Cpu}
            label="Concurrency"
            value={
              typeof summary.concurrencyFactor === 'number'
                ? `${(summary.concurrencyFactor * 100).toFixed(0)} %`
                : '-'
            }
          />
          <StatCard
            icon={Clock}
            label="Peak Date"
            value={
              summary.actualPeakAt
                ? new Intl.DateTimeFormat('en-US', {
                    day: '2-digit',
                    month: 'short',
                  }).format(new Date(summary.actualPeakAt))
                : 'N/A'
            }
          />{' '}
          <StatCard
            icon={Bolt}
            label="Total Energy"
            value={safeFixed(summary.totalEnergyKwh, 0, 'kWh')}
          />
          <StatCard
            icon={ThermometerSnowflake}
            label="Events"
            value={summary.eventsTotal?.toString() ?? '-'}
          />
        </div>
      ) : (
        <p className="text-sm text-gray-600">No summary available.</p>
      )}
    </div>
  );
}

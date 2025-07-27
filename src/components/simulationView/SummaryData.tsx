import { BarChart, Activity, Cpu, Zap, Car, Clock } from 'lucide-react';
import StatCard from './StatCard';

function safeFixed(val: unknown, digits = 0, unit = '') {
  return typeof val === 'number'
    ? `${val.toFixed(digits)}${unit ? ` ${unit}` : ''}`
    : '-';
}

export default function SummaryData({ sim }: { sim: any }) {
  console.log('SummaryData', sim);
  return (
    <div className="mt-4 space-y-4 ">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          {sim.name || 'Untitled'}
        </h2>
        <span className="inline-flex items-center gap-2 text-sm text-gray-500 mt-2 sm:mt-0">
          <BarChart className="w-4 h-4" />
          <span className="capitalize">{sim.status}</span>
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon={Activity}
          label="Arrival Multiplier"
          value={safeFixed(sim.arrivalMultiplier, 2)}
        />
        <StatCard
          icon={Cpu}
          label="Chargepoints"
          value={sim.chargepointCount?.toString() ?? '-'}
        />
        <StatCard
          icon={Zap}
          label="Charger Power"
          value={safeFixed(sim.chargerPowerKw, 0, 'kW')}
        />
        <StatCard
          icon={Car}
          label="Consumption"
          value={safeFixed(sim.consumptionKwhPer100km, 0, 'kWh / 100km')}
        />
        <StatCard
          icon={Clock}
          label="Duration"
          value={
            sim.summary.durationHours ? `${sim.summary.durationHours} h` : '-'
          }
        />
      </div>
    </div>
  );
}

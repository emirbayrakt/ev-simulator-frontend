import { useNavigate } from 'react-router-dom';
import {
  Play,
  Pencil,
  Trash2,
  Eye,
  Zap,
  BarChart,
  Gauge,
  TrendingUp,
  PlugZap,
} from 'lucide-react';
import StatusBadge from './StatusBadge';

export type Simulation = {
  id: string;
  name?: string | null;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  chargepointCount: number;
  chargerPowerKw: number;
  arrivalMultiplier: number;
  consumptionKwhPer100km: number;
  summary?: {
    totalEnergyKwh: number;
    actualPeakKw: number;
    concurrencyFactor: number;
    eventsTotal: number;
  } | null;
};

type Props = {
  sim: Simulation;
  onPlay: (_id: string) => void;
  onEdit: (_sim: Simulation) => void;
  onDelete: (_id: string) => void;
};

export default function SimulationCard({
  sim,
  onPlay,
  onEdit,
  onDelete,
}: Props) {
  const navigate = useNavigate();
  const canView = sim.status === 'completed';
  const canEdit = sim.status !== 'running' && sim.status !== 'completed';

  const handleOpen = () => {
    if (canView) navigate(`/simulations/${sim.id}`);
  };

  return (
    <div className="rounded-xl border border-gray-50 bg-white hover:bg-[#fbfbfb] p-5 shadow-md hover:shadow-lg flex flex-col sm:flex-row gap-6">
      {/* Main info section */}
      <div onClick={handleOpen} className="flex-1 space-y-2 ">
        <div className="flex items-center gap-3">
          <h3
            className={`text-lg font-semibold ${
              canView ? 'cursor-pointer hover:underline' : 'text-gray-500'
            }`}
            title={canView ? 'Open simulation' : 'Available when completed'}
          >
            {sim.name || 'Untitled Simulation'}
          </h3>
          <StatusBadge status={sim.status} />
        </div>

        <div className="text-sm text-gray-600 space-y-1">
          <div className="flex items-center gap-2">
            <PlugZap className="h-4 w-4 text-gray-400" />
            {sim.chargepointCount} CP × {sim.chargerPowerKw} kW
          </div>
          <div className="flex items-center gap-x-2 gap-y-[2px] flex-wrap ">
            <div className="flex items-center gap-1  ">
              <BarChart className="h-4 w-4 text-gray-400" />
              Arrival × <b>{sim.arrivalMultiplier}</b>
            </div>{' '}
            <div className="flex items-center gap-1  ">
              • Consumption: <b>{sim.consumptionKwhPer100km}</b> kWh/100km
            </div>
          </div>
        </div>

        {sim.summary && (
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-500" />
              <span>
                <b>{sim.summary.totalEnergyKwh.toFixed(0)}</b> kWh
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-emerald-600" />
              <span>
                <b>{sim.summary.actualPeakKw.toFixed(1)}</b> kW peak
              </span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <span>
                <b>{(sim.summary.concurrencyFactor * 100).toFixed(0)}%</b>{' '}
                concurrency
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 items-start sm:items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
        {canView ? (
          <button
            onClick={handleOpen}
            className="inline-flex items-center gap-1 rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
            title="View"
          >
            <Eye className="w-4 h-4" /> View
          </button>
        ) : (
          <div></div>
        )}
        <button
          onClick={() => onPlay(sim.id)}
          className="inline-flex items-center gap-1 rounded-md border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-40"
          disabled={sim.status !== 'queued'}
          title="Run"
        >
          <Play className="w-4 h-4" /> Run
        </button>
        <button
          onClick={() => onEdit(sim)}
          className="inline-flex items-center gap-1 rounded-md border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-40"
          disabled={!canEdit}
          title="Edit"
        >
          <Pencil className="w-4 h-4" /> Edit
        </button>
        <button
          onClick={() => onDelete(sim.id)}
          className="inline-flex items-center gap-1 rounded-md border border-red-400 text-red-700 px-3 py-2 text-sm hover:bg-red-50"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" /> Delete
        </button>
      </div>
    </div>
  );
}

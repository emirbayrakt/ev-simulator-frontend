import { PlugZap } from 'lucide-react';
import carImage from '../../assets/car.png';

type CpState = {
  power_kw?: number[];
  occupied?: boolean[];
  energy_kwh?: number[];
};

type Props = {
  cpState: CpState;
  chargepointCount: number;
};

function Tooltip({ label }: { label: string }) {
  return (
    <div className="absolute z-20 -top-2 left-1/2 -translate-x-1/2 -translate-y-full whitespace-pre rounded bg-black px-2 py-1 text-xs text-white shadow">
      {label}
    </div>
  );
}

export default function ChargepointsGrid({ cpState, chargepointCount }: Props) {
  const power = cpState?.power_kw ?? [];
  const occ = cpState?.occupied ?? [];
  const energy = cpState?.energy_kwh ?? [];

  const items = Array.from({ length: chargepointCount }, (_, i) => {
    const p = power[i] ?? 0;
    const o = occ[i] ?? false;
    const e = energy[i] ?? 0;
    return { index: i + 1, p, o, e };
  });

  const maxEnergy = Math.max(1, ...items.map((x) => x.e));

  return (
    <div className="space-y-4">
      <div className="text-sm font-semibold ">Chargepoint Grid</div>
      <div
        className={`grid gap-3 grid-cols-2 sm:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5`}
      >
        {items.map(({ index, p, o, e }) => {
          const ratio = e / maxEnergy;
          const bg = `hsl(210deg 50% ${95 - Math.round(35 * ratio)}%)`;
          const tooltip = `CP #${index}
Energy: ${e.toFixed(2)} kWh
Power@peak: ${p.toFixed(2)} kW
Occupied@peak: ${o ? 'Yes' : 'No'}`;

          return (
            <div key={index} className="relative group">
              <div
                className={`rounded-md border aspect-[3/2] flex items-center justify-center relative shadow-sm transition-all ${
                  o ? 'border-blue-500' : 'border-gray-300'
                }`}
                style={{ backgroundColor: bg }}
              >
                {o ? (
                  <img
                    src={carImage}
                    alt="Car"
                    className="h-16 w-16 object-contain"
                  />
                ) : (
                  <PlugZap className="h-5 w-5 text-gray-400" />
                )}
                <div className="absolute bottom-0 right-0 text-[10px] text-gray-500 pr-1 pb-1">
                  #{index}
                </div>
              </div>

              <div className="pointer-events-none absolute z-10 hidden group-hover:block">
                <Tooltip label={tooltip} />
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-gray-500 leading-tight">
        <strong>White car</strong> = occupied at peak, color shade = energy
        usage over hour.
      </p>
    </div>
  );
}

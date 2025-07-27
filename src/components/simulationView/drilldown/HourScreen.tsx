import { useRef, useState } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import { DateTime } from 'luxon';
import BackBar from './BackBar';
import HourlyHeatmap from './heatmaps/HourlyHeatmap';
import ChargepointsGrid from '../ChargepointsGrid';
import {
  SIMULATION_HOURLY_FOR_DATE,
  SIMULATION_HOURLY_DETAIL,
} from '../../../graphql/queries';
import Loading from '../../Loading';

type Props = {
  simulationId: string;
  dayIso: string; // ISO date of the day
  chargepointCount: number;
  onBack: () => void; // Callback for back navigation
};

export default function HourScreen({
  simulationId,
  dayIso,
  chargepointCount,
  onBack,
}: Props) {
  const [selectedHourIso, setSelectedHourIso] = useState<string | null>(null);
  const cpGridRef = useRef<HTMLDivElement | null>(null);

  // hourly rows
  const { data, loading, error } = useQuery(SIMULATION_HOURLY_FOR_DATE, {
    variables: { simulationId, date: DateTime.fromISO(dayIso).toISODate() },
    fetchPolicy: 'network-only',
  });
  const hours = data?.simulationHourlyForDate ?? [];

  // hour detail (lazy)
  const [fetchDetail, detailState] = useLazyQuery(SIMULATION_HOURLY_DETAIL);

  const selectHour = async (iso: string) => {
    setSelectedHourIso(iso);
    await fetchDetail({
      variables: { simulationId, hourStart: iso },
      fetchPolicy: 'network-only',
    });

    // Scroll to chargepoint grid after a small delay to ensure it's rendered
    setTimeout(() => {
      cpGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const detail = detailState.data?.simulationHourlyDetail;

  return (
    <div className="space-y-4 relative">
      <BackBar
        title="Hours"
        subtitle={DateTime.fromISO(dayIso).toFormat('dd LLL ')}
        onBack={onBack}
      />

      {error && <p className="text-red-600 text-sm">{error.message}</p>}
      {loading ? (
        <Loading />
      ) : (
        <HourlyHeatmap
          rows={hours}
          onSelectHour={selectHour}
          selectedHour={selectedHourIso ?? undefined}
          metric="peak"
        />
      )}

      {/* detail & CP grid */}
      {selectedHourIso && (
        <div className="space-y-3" ref={cpGridRef}>
          {detailState.loading ? (
            <div className="text-sm text-gray-500 min-h-[350px] flex items-center justify-center">
              <Loading />
            </div>
          ) : detail ? (
            <>
              <div className="text-sm text-gray-700">
                <b>
                  {DateTime.fromISO(selectedHourIso).toFormat('dd LLL HH:mm')}
                </b>{' '}
                — Energy: <b>{detail.energyKwh.toFixed(2)}</b> kWh • Peak:{' '}
                <b>{detail.max15mPowerKw.toFixed(1)}</b> kW at +
                {detail.max15mMinute}′ • Charges: <b>{detail.eventsCount}</b>
              </div>
              <ChargepointsGrid
                cpState={detail.cpState as any}
                chargepointCount={chargepointCount}
              />
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}

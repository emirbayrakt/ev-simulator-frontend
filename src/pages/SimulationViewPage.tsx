import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  SIMULATION_CONTEXT_QUERY,
  SIMULATION_MONTHLY_AGG,
  SIMULATION_DAILY_AGG,
} from '../graphql/queries';
import Loading from '../components/Loading';
import YearSummary from '../components/simulationView/YearSummary';
import DrilldownPanel from '../components/simulationView/drilldown/DrilldownPanel';
import ChargepointInsightsPanel from '../components/simulationView/ChargepointInsightsPanel';
import { usePageTitle } from '../hooks/usePageTitle';
import SummaryData from '../components/simulationView/SummaryData';
import FullPageError from '../components/FullPageError';

export default function SimulationViewPage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: ctxData,
    loading: ctxLoading,
    error: ctxError,
  } = useQuery(SIMULATION_CONTEXT_QUERY, {
    variables: { id },
    fetchPolicy: 'network-only',
  });
  const sim = ctxData?.simulation;

  usePageTitle(`View Simulation ${sim?.name ?? ''}`);

  const { data: monthData } = useQuery(SIMULATION_MONTHLY_AGG, {
    skip: !id,
    variables: { simulationId: id },
  });

  const months = useMemo(
    () => monthData?.simulationMonthlyAggregates ?? [],
    [monthData],
  );

  const { data: dailyAggData } = useQuery(SIMULATION_DAILY_AGG, {
    skip: !id,
    variables: { simulationId: id },
  });

  const dailyAggAll = useMemo(
    () => dailyAggData?.simulationDailyAggregates ?? [],
    [dailyAggData],
  );

  if (ctxLoading) return <Loading />;
  if (ctxError) return <FullPageError message={ctxError.message} />;
  if (!sim) return <p>Not found</p>;
  if (sim.status !== 'completed') {
    return (
      <p className="text-gray-600">This simulation is not completed yet.</p>
    );
  }

  return (
    <div className="space-y-6">
      {/* TOP: Full-width config data */}
      <SummaryData sim={sim} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: yearly summary & CP Chart */}
        <div>
          <YearSummary sim={sim} />
          <ChargepointInsightsPanel
            simulationId={sim?.id}
            chargepointCount={sim?.chargepointCount}
          />
        </div>

        {/* RIGHT: drill-down screens */}
        <DrilldownPanel
          simulationId={id!}
          months={months}
          dailyAggAll={dailyAggAll}
          chargepointCount={sim.chargepointCount}
        />
      </div>
    </div>
  );
}

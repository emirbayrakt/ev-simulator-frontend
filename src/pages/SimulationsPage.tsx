import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { SIMULATIONS_QUERY } from '../graphql/queries';
import { OctagonX, Plus } from 'lucide-react';
import {
  DELETE_SIMULATION,
  RUN_SIMULATION,
  UPDATE_SIMULATION,
} from '../graphql/mutations';
import SimulationCard, {
  Simulation,
} from '../components/simulationList/SimulationCard';
import EditSimulationModal from '../components/forms/EditSimulationModal';
import Loading from '../components/Loading';
import { SimulationFormValues } from '../schemas/simulation';
import Toast from '../components/Toast';
import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';
import FullPageError from '../components/FullPageError';

export default function SimulationsPage() {
  const { data, loading, error, refetch } = useQuery<{
    simulations: Simulation[];
  }>(SIMULATIONS_QUERY, {
    pollInterval: 5000,
    fetchPolicy: 'network-only',
  });

  const [updateSimulation] = useMutation(UPDATE_SIMULATION);
  const [deleteSimulation] = useMutation(DELETE_SIMULATION);
  const [runSimulation] = useMutation(RUN_SIMULATION);

  const [editing, setEditing] = useState<Simulation | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  usePageTitle('Home');

  const simulations = useMemo(() => data?.simulations ?? [], [data]);

  const onEdit = async (vals: SimulationFormValues) => {
    if (!editing) return;
    try {
      await updateSimulation({
        variables: {
          id: editing.id,
          input: { ...vals },
        },
      });
      setToast({ message: 'Simulation updated!', type: 'success' });
      setEditing(null);
      await refetch();
    } catch (err: any) {
      setToast({ message: err.message ?? 'Update failed.', type: 'error' });
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm('Delete this simulation?')) return;
    try {
      await deleteSimulation({ variables: { id } });
      setToast({ message: 'Simulation deleted.', type: 'success' });
      await refetch();
    } catch (err: any) {
      setToast({ message: err.message ?? 'Failed to delete.', type: 'error' });
    }
  };

  const onPlay = async (id: string) => {
    try {
      await runSimulation({ variables: { id } });
      setToast({ message: 'Simulation ready!', type: 'success' });
      await refetch();
    } catch (err: any) {
      setToast({
        message: err.message ?? 'Failed to start simulation.',
        type: 'error',
      });
    }
  };

  return (
    <div className="space-y-6 w-full ">
      <section>
        <section className="flex items-center justify-between  mt-4 mb-4">
          <h2 className="text-2xl font-semibold">All Simulations</h2>
          <Link
            to="/simulations/new"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition"
          >
            <Plus className="w-4 h-4" />
            New Simulation
          </Link>
        </section>
        <div>
          <p className="text-gray-600 mb-6">
            Simulations are used to model EV charging scenarios. You can create
            new simulations, edit existing ones, and run them to see results.
          </p>
        </div>
        {loading && <Loading />}
        {error && <FullPageError message={error.message} />}

        {!loading && simulations.length === 0 ? (
          <div className="rounded-lg border-dashed border-2 border-gray-200 bg-white p-10 flex flex-col items-center justify-center text-center text-gray-600">
            <OctagonX />
            <p className="mt-3">No simulations yet.</p>
            <Link
              to="/simulations/new"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition"
            >
              <Plus className="w-4 h-4" />
              Create Simulation
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6  flex-1 p-6 border border-gray-200 rounded-xl">
            {simulations.map((sim) => (
              <SimulationCard
                key={sim.id}
                sim={sim}
                onPlay={onPlay}
                onEdit={(s) => setEditing(s)}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </section>

      <EditSimulationModal
        open={!!editing}
        initial={editing ?? undefined}
        onClose={() => setEditing(null)}
        onSubmit={onEdit}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

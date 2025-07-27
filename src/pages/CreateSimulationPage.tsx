import { useMutation, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { CREATE_SIMULATION } from '../graphql/mutations';
import { SIMULATIONS_QUERY } from '../graphql/queries';
import { SimulationFormValues } from '../schemas/simulation';
import SimulationForm from '../components/forms/SimulationForm';
import Toast from '../components/Toast';
import Loading from '../components/Loading';
import { usePageTitle } from '../hooks/usePageTitle';
import FullPageError from '../components/FullPageError';

export default function CreateSimulationPage() {
  const navigate = useNavigate();
  const [createSimulation] = useMutation(CREATE_SIMULATION);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const { data, loading, error, refetch } = useQuery(SIMULATIONS_QUERY, {
    fetchPolicy: 'network-only',
  });

  const simulations = useMemo(() => data?.simulations ?? [], [data]);
  const isLimitReached = simulations.length >= 6;

  const [isSubmitting, setIsSubmitting] = useState(false);

  usePageTitle('Create Simulation');

  const handleCreate = async (values: SimulationFormValues) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Re-check simulation count before sending mutation
      const res = await refetch();
      if ((res.data?.simulations?.length ?? 0) >= 6) {
        setToast({
          message: 'Limit of 6 simulations reached. Please delete one first.',
          type: 'error',
        });
        setIsSubmitting(false);
        return;
      }

      await createSimulation({ variables: { input: { ...values } } });
      setToast({
        message: 'Simulation created successfully!',
        type: 'success',
      });

      setTimeout(() => navigate('/simulations'), 1500);
    } catch (err: any) {
      setToast({
        message: err.message ?? 'Failed to create simulation.',
        type: 'error',
      });
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <FullPageError message="Error loading simulations" />;
  return (
    <div className="mt-6 space-y-4">
      <h1 className="text-2xl font-semibold">Create Simulation</h1>
      <p className="text-gray-600">
        Create a new simulation by filling out the form below. You can have a
        maximum of 6 simulations at a time.
      </p>

      {isLimitReached ? (
        <div className="rounded-md bg-yellow-100 border border-yellow-300 text-yellow-900 p-4 text-sm">
          You already have 6 simulations. Please delete one before creating a
          new one.
        </div>
      ) : (
        <SimulationForm
          onCreate={handleCreate}
          simulationCount={simulations.length}
          disabled={isSubmitting}
        />
      )}

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

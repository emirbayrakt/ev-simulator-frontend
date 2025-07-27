import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import SimulationFields from './SimulationFields';
import {
  simulationFormSchema,
  simulationDefaultValues,
  type SimulationFormValues,
} from '../../schemas/simulation';

type Props = {
  onCreate: (_values: SimulationFormValues) => Promise<void>;
  simulationCount: number;
  disabled?: boolean;
};

const MAX_SIMULATIONS = 6;

export default function SimulationForm({
  onCreate,
  simulationCount,
  disabled = false,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SimulationFormValues>({
    resolver: zodResolver(simulationFormSchema),
    defaultValues: simulationDefaultValues,
  });

  const isFull = simulationCount >= MAX_SIMULATIONS;

  const submit = async (values: SimulationFormValues) => {
    await onCreate({
      ...values,
    });
    reset(simulationDefaultValues);
  };

  return (
    <form
      id="create"
      onSubmit={handleSubmit(submit)}
      className="rounded-xl  bg-white p-6 border border-gray-200 mt-8"
    >
      <h3 className="text-lg font-semibold mb-4">Create New Simulation</h3>

      {isFull ? (
        <div className="text-sm text-red-600 mb-4">
          ⚠️ You’ve reached the maximum of {MAX_SIMULATIONS} simulations. Please
          delete one to create a new simulation.
        </div>
      ) : (
        <SimulationFields register={register} errors={errors} />
      )}

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          className="btn-primary"
          disabled={isSubmitting || isFull || disabled}
        >
          {isSubmitting ? 'Creating...' : 'Create'}
        </button>
      </div>
    </form>
  );
}

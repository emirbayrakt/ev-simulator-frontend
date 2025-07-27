import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import SimulationFields from './SimulationFields';
import {
  simulationFormSchema,
  type SimulationFormValues,
} from '../../schemas/simulation';
import type { Simulation } from '../simulationList/SimulationCard';
import { CircleX } from 'lucide-react';

type Props = {
  open: boolean;
  onClose: () => void;
  initial?: Simulation;
  onSubmit: (_values: SimulationFormValues) => Promise<void>;
};

export default function EditSimulationModal({
  open,
  onClose,
  initial,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SimulationFormValues>({
    resolver: zodResolver(simulationFormSchema),
  });

  useEffect(() => {
    if (open && initial) {
      reset({
        name: initial.name ?? '',
        arrivalMultiplier: (initial as any).arrivalMultiplier ?? 1,
        chargepointCount: initial.chargepointCount,
        consumptionKwhPer100km: (initial as any).consumptionKwhPer100km ?? 18,
        chargerPowerKw: initial.chargerPowerKw,
        seed: (initial as any).seed ?? undefined, // keep undefined when blank
      });
    }
  }, [open, initial, reset]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2 md:px-0">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Edit Simulation</h3>
          <button
            className="text-gray-500 hover:text-gray-800"
            onClick={onClose}
          >
            <CircleX />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(async (v) => {
            await onSubmit(v);
            onClose();
          })}
          className="grid grid-cols-1 gap-4"
        >
          <SimulationFields register={register} errors={errors} />

          <div className="flex justify-end gap-2 mt-2">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

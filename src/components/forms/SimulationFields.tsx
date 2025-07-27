import { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { SimulationFormValues } from '../../schemas/simulation';

type Props = {
  register: UseFormRegister<SimulationFormValues>;
  errors: FieldErrors<SimulationFormValues>;
};

export default function SimulationFields({ register, errors }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          className="input"
          {...register('name')}
          placeholder="My yearly sim"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Arrival Multiplier</label>
        <input
          type="number"
          step="0.01"
          className="input"
          {...register('arrivalMultiplier', { valueAsNumber: true })}
        />
        {errors.arrivalMultiplier && (
          <p className="text-xs text-red-600">
            {errors.arrivalMultiplier.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">
          Chargepoints (max 40)
        </label>
        <input
          type="number"
          className="input"
          {...register('chargepointCount', { valueAsNumber: true })}
        />
        {errors.chargepointCount && (
          <p className="text-xs text-red-600">
            {errors.chargepointCount.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">
          Consumption (kWh/100km)
        </label>
        <input
          type="number"
          step="0.1"
          className="input"
          {...register('consumptionKwhPer100km', { valueAsNumber: true })}
        />
        {errors.consumptionKwhPer100km && (
          <p className="text-xs text-red-600">
            {errors.consumptionKwhPer100km.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Charger Power (kW)</label>
        <input
          type="number"
          step="0.1"
          className="input"
          {...register('chargerPowerKw', { valueAsNumber: true })}
        />
        {errors.chargerPowerKw && (
          <p className="text-xs text-red-600">
            {errors.chargerPowerKw.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Seed (optional)</label>
        <input
          type="number"
          className="input"
          {...register('seed', {
            // important: blank → undefined (so optional schema passes)
            setValueAs: (v) => (v === '' || v === null ? undefined : Number(v)),
          })}
        />
        {errors.seed && (
          <p className="text-xs text-red-600">{errors.seed.message}</p>
        )}
      </div>
    </div>
  );
}

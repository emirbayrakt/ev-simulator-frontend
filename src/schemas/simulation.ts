import { z } from 'zod';

export const simulationFormSchema = z.object({
  name: z.string().optional(),
  seed: z.number().int().optional().nullable(),
  arrivalMultiplier: z.number().min(0.2).max(2),
  chargepointCount: z.number().int().min(1).max(40),
  consumptionKwhPer100km: z.number().min(5).max(40),
  chargerPowerKw: z.number().min(1).max(400),
});

export type SimulationFormValues = z.infer<typeof simulationFormSchema>;

export const simulationDefaultValues: Partial<SimulationFormValues> = {
  arrivalMultiplier: 1,
  chargepointCount: 20,
  consumptionKwhPer100km: 18,
  chargerPowerKw: 11,
};

import seedrandom from 'seedrandom';
import { chargingDemands, hourlyArrivalProbs } from './simData';

type SimOptions = {
  useSeed?: boolean;
  seed?: string;
  maxChargepoints?: number;
};

type SimResult = {
  totalEnergy: number;
  theoreticalMaxPower: number;
  actualMaxPower: number;
  concurrencyFactor: number;
};

type RNG = () => number;

// Function to get random km demand
function sampleChargingDemand(rng: RNG): number {
  const rand = rng();
  let cumulative = 0;
  for (const demand of chargingDemands) {
    cumulative += demand.prob;
    if (rand < cumulative) {
      return demand.km;
    }
  }
  return 0;
}

// Run one full-year simulation for a given number of chargepoints
export function simulate(numChargepoints: number, rng: RNG): SimResult {
  const intervalsPerDay = 24 * 4;
  const totalIntervals = 365 * intervalsPerDay;

  let totalEnergy = 0;
  let maxPower = 0;

  // Create an array to track the remaining energy (in kWh) that each chargepoint needs to deliver to the currently charging EV.
  // Initially, all chargepoints are free (remaining energy is 0).
  const remainingEnergies: number[] = new Array(numChargepoints).fill(0);

  for (let intervalIdx = 0; intervalIdx < totalIntervals; intervalIdx++) {
    // Calculate the current interval's position within the day (0 to 95, since there are 96 intervals in a day: 24 hours * 4 intervals per hour).
    const intervalInDay = intervalIdx % intervalsPerDay;

    // Determine the current hour (0 to 23) based on the interval's position within the day.
    const hour = Math.floor(intervalInDay / 4);

    // Calculate the probability of an EV arriving at a chargepoint in this 15-minute interval.
    // The hourly arrival probability is divided by 4 to distribute it evenly across the four 15-minute intervals in the hour.
    // This assumes arrivals are uniformly distributed within the hour.
    const arrivalProbPerChargepoint = hourlyArrivalProbs[hour] / 4;

    // Initialize the total energy delivered by all chargepoints in this interval to 0.
    let intervalEnergy = 0;

    // Loop through each chargepoint to process its state (free or occupied) and simulate charging behavior.
    for (let i = 0; i < numChargepoints; i++) {
      // Check if the chargepoint is free (no EV currently charging).
      if (remainingEnergies[i] <= 0) {
        // With probability arrivalProbPerChargepoint, an EV arrives at this chargepoint.
        if (rng() < arrivalProbPerChargepoint) {
          // Sample the charging demand (in km) for the arriving EV.
          const km = sampleChargingDemand(rng);

          // If the EV has a non-zero charging demand, calculate the required energy (in kWh) and assign it to the chargepoint.
          if (km > 0) {
            remainingEnergies[i] = km * 0.18; // 0.18 kWh per km.
          }
        }
      }

      // If the chargepoint is occupied (has remaining energy to deliver), charge the EV.
      if (remainingEnergies[i] > 0) {
        // The chargepoint delivers energy at 11 kW, which is 2.75 kWh per 15-minute interval
        // Deliver the smaller of the remaining energy or 2.75 kWh to avoid over-delivery.
        const energyToDeliver = Math.min(remainingEnergies[i], 2.75);

        // Add the delivered energy to the interval's total energy.
        intervalEnergy += energyToDeliver;

        // Subtract the delivered energy from the remaining energy for this chargepoint.
        remainingEnergies[i] -= energyToDeliver;

        // Ensure the remaining energy doesn't go negative.
        if (remainingEnergies[i] < 0) {
          remainingEnergies[i] = 0;
        }
      }
    }

    // Add the interval's total energy to the yearly total energy consumption.
    totalEnergy += intervalEnergy;
    // Convert the interval's energy (kWh per 0.25 hours) to power (kW) by multiplying by 4 (since 1 kWh per 0.25 hours = 4 kW).
    const powerThisInterval = intervalEnergy * 4;

    // Update the maximum power demand if this interval's power is higher than the current maximum.
    if (powerThisInterval > maxPower) {
      maxPower = powerThisInterval;
    }
  }

  const theoreticalMaxPower = numChargepoints * 11;
  const concurrencyFactor = maxPower / theoreticalMaxPower;

  return {
    totalEnergy,
    theoreticalMaxPower,
    actualMaxPower: maxPower,
    concurrencyFactor,
  };
}

export function runSimulations(opts: SimOptions = {}): string[] {
  const { useSeed = false, seed = 'default', maxChargepoints = 30 } = opts;
  const rng = useSeed ? seedrandom(seed) : Math.random;

  const logs: string[] = [];

  const single = simulate(20, rng);
  logs.push('--- Single Simulation (20 CPs) ---');
  logs.push(`Total energy: ${single.totalEnergy.toFixed(2)} kWh`);
  logs.push(`Theoretical max power: ${single.theoreticalMaxPower} kW`);
  logs.push(`Actual max power: ${single.actualMaxPower.toFixed(2)} kW`);
  logs.push(`Concurrency: ${(single.concurrencyFactor * 100).toFixed(2)}%\n`);

  logs.push('--- Concurrency vs Chargepoints ---');
  for (let n = 1; n <= maxChargepoints; n++) {
    const r = simulate(n, rng);
    logs.push(
      `${n.toString().padStart(2)} CP | Concurrency: ${(
        r.concurrencyFactor * 100
      ).toFixed(2)}%`,
    );
  }

  return logs;
}

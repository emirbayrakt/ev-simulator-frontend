import { gql } from '@apollo/client';

export const SIMULATIONS_QUERY = gql`
  query Simulations {
    simulations {
      id
      name
      status
      arrivalMultiplier
      chargepointCount
      consumptionKwhPer100km
      chargerPowerKw
      createdAt
      updatedAt
      summary {
        totalEnergyKwh
        theoreticalMaxKw
        actualPeakKw
        actualPeakAt
        concurrencyFactor
        eventsTotal
        durationHours
      }
    }
  }
`;

export const SIMULATION_MIN_QUERY = gql`
  query Simulation($id: ID!) {
    simulation(id: $id) {
      id
      name
      status
      summary {
        totalEnergyKwh
        theoreticalMaxKw
        actualPeakKw
        actualPeakAt
        concurrencyFactor
        eventsTotal
        durationHours
      }
    }
  }
`;

export const SIMULATION_CONTEXT_QUERY = gql`
  query SimulationContext($id: ID!) {
    simulation(id: $id) {
      id
      name
      status
      chargepointCount
      arrivalMultiplier
      chargerPowerKw
      consumptionKwhPer100km
      summary {
        totalEnergyKwh
        theoreticalMaxKw
        actualPeakKw
        actualPeakAt
        concurrencyFactor
        eventsTotal
        durationHours
      }
    }
  }
`;

export const SIMULATION_HOURLY_FOR_DATE = gql`
  query HourlyForDate($simulationId: ID!, $date: Date!) {
    simulationHourlyForDate(simulationId: $simulationId, date: $date) {
      id
      hourStart
      energyKwh
      avgPowerKw
      max15mPowerKw
      max15mMinute
      eventsCount
    }
  }
`;

export const SIMULATION_HOURLY_DETAIL = gql`
  query HourlyDetail($simulationId: ID!, $hourStart: DateTime!) {
    simulationHourlyDetail(simulationId: $simulationId, hourStart: $hourStart) {
      id
      hourStart
      energyKwh
      avgPowerKw
      max15mPowerKw
      max15mMinute
      eventsCount
      busyCpCountAvg
      cpState
    }
  }
`;

export const SIMULATION_MONTHLY_AGG = gql`
  query SimulationMonthly($simulationId: ID!) {
    simulationMonthlyAggregates(simulationId: $simulationId) {
      periodStart
      periodEnd
      energyKwh
      eventsCount
      max15mPowerKw
    }
  }
`;

export const SIMULATION_DAILY_AGG = gql`
  query SimulationDaily($simulationId: ID!) {
    simulationDailyAggregates(simulationId: $simulationId) {
      periodStart
      periodEnd
      energyKwh
      eventsCount
      max15mPowerKw
    }
  }
`;

export const SIMULATION_CP_DAILY_SERIES = gql`
  query CpDailySeries($simulationId: ID!, $cpIndex: Int!) {
    simulationChargepointDailySeries(
      simulationId: $simulationId
      cpIndex: $cpIndex
    ) {
      date
      energyKwh
      powerKw
      occupied
    }
  }
`;

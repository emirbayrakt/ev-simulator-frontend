import { gql } from '@apollo/client';

export const CREATE_SIMULATION = gql`
  mutation CreateSimulation($input: CreateSimulationInput!) {
    createSimulation(input: $input) {
      id
      name
    }
  }
`;

export const UPDATE_SIMULATION = gql`
  mutation UpdateSimulation($id: ID!, $input: UpdateSimulationInput!) {
    updateSimulation(id: $id, input: $input) {
      id
      status
      name
      arrivalMultiplier
      chargepointCount
      consumptionKwhPer100km
      chargerPowerKw
    }
  }
`;

export const DELETE_SIMULATION = gql`
  mutation DeleteSimulation($id: ID!) {
    deleteSimulation(id: $id)
  }
`;

export const RUN_SIMULATION = gql`
  mutation RunSimulation($id: ID!) {
    runSimulation(id: $id) {
      id
      status
    }
  }
`;

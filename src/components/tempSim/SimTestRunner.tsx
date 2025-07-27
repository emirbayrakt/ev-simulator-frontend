import React, { useState } from 'react';
import { runSimulations } from '../../lib/simRunner';

type SimInput = {
  useSeed: boolean;
  seed: string;
  maxChargepoints: number;
};

export default function SimTestRunner() {
  const [inputs, setInputs] = useState<SimInput>({
    useSeed: false,
    seed: '',
    maxChargepoints: 30,
  });

  const [logs, setLogs] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const runSim = () => {
    const logs = runSimulations({
      useSeed: inputs.useSeed,
      seed: inputs.seed,
      maxChargepoints: Number(inputs.maxChargepoints),
    });
    setLogs(logs);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Form */}
      <div className="rounded-lg  bg-gray-50  shadow-md p-6 space-y-5">
        <h2 className="text-lg font-semibold">Simulation Input</h2>

        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            name="useSeed"
            checked={inputs.useSeed}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Use Seed
        </label>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Seed
          </label>
          <input
            type="text"
            name="seed"
            value={inputs.seed}
            onChange={handleChange}
            disabled={!inputs.useSeed}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Chargepoints
          </label>
          <input
            type="number"
            name="maxChargepoints"
            value={inputs.maxChargepoints}
            onChange={handleChange}
            min={1}
            max={100}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
        </div>

        <button
          onClick={runSim}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-md transition"
        >
          Run Simulation
        </button>
      </div>

      {/* Output */}
      <div className="mt-4 rounded-md border bg-black text-white p-4 font-mono text-sm whitespace-pre-wrap overflow-y-auto max-h-[300px]">
        {logs.length > 0 ? logs.join('\n') : 'Run a simulation to see output.'}
      </div>
    </div>
  );
}

import SimTestRunner from '../components/tempSim/SimTestRunner';
import { usePageTitle } from '../hooks/usePageTitle';

export default function QuickTestSimPage() {
  usePageTitle('Quick Test Simulation');

  return (
    <div className="mt-6 ">
      <h1 className="text-2xl font-semibold ">Quick Test Simulation</h1>
      <p className="text-gray-600 mt-4 mb-8">
        Run a one-off simulation using seed and chargepoint inputs. Results are
        shown below the form. This does not save a simulation to the system.
      </p>

      <div className="rounded-xl bg-white p-6 border border-gray-200 ">
        <SimTestRunner />
      </div>
    </div>
  );
}

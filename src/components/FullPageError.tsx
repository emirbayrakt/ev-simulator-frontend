import { AlertTriangle } from 'lucide-react';

type Props = {
  message?: string;
};

export default function FullPageError({
  message = 'Something went wrong.',
}: Props) {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100">
          <AlertTriangle className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-xl font-semibold text-gray-800">Oops!</h1>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}

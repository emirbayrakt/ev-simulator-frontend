import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Heart } from 'lucide-react';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1  p-6 w-full max-w-7xl mx-auto">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500">
          <div>© {new Date().getFullYear()} EV Charge Sim</div>
          <div className="flex items-center gap-1 mt-2 sm:mt-0">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span>by Emir Bayraktar</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

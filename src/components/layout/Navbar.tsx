import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Menu, PlugZap, X } from 'lucide-react';
import { useState } from 'react';

const links = [
  { to: '/', label: 'Home' },
  { to: '/simulations', label: 'Simulations', end: true },
  { to: '/simulations/new', label: 'Create Simulation' },
  { to: '/quick-test', label: 'Quick Test Sim' },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome =
    location.pathname === '/' || location.pathname === '/simulations';

  return (
    <nav className="bg-purple-900 sticky top-0 z-20 shadow-md">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-14 items-center justify-between py-6">
          <div className="flex items-center gap-2 md:gap-4">
            {!isHome && (
              <button
                onClick={() => navigate('/simulations')}
                className="text-purple-300 hover:text-white"
                title="Back to Simulations"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div
              onClick={() => navigate('/simulations')}
              className="cursor-pointer text-[14px] md:text-lg font-bold text-white"
            >
              <div className="flex items-center gap-2">
                <PlugZap className="w-7 h-7" />
                EV Charge Sim
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="sm:hidden text-purple-300 hover:text-white"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Desktop links */}
          <div className="hidden sm:flex gap-1 md:gap-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive
                      ? 'bg-white text-purple-900 shadow'
                      : 'text-purple-300 hover:text-white hover:bg-purple-700'
                  }`
                }
                end={link.end}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="sm:hidden flex flex-col gap-1 pb-3 animate-fade-in">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium transition ${
                    isActive
                      ? 'bg-white text-purple-900 shadow'
                      : 'text-purple-300 hover:text-white hover:bg-purple-700'
                  }`
                }
                onClick={() => setOpen(false)}
                end={link.end}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

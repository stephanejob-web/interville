import { NavLink } from 'react-router-dom';

export const Navbar = () => {
  return (
    <div className="navbar bg-base-300">
      <div className="navbar-start">
        <span className="text-xl font-bold">Interville</span>
      </div>
      <div className="navbar-end gap-2">
        <NavLink to="/" className="btn btn-sm btn-ghost">
          Accueil
        </NavLink>
        <NavLink to="/chat" className="btn btn-sm btn-ghost">
          Chat
        </NavLink>
        <NavLink to="/login" className="btn btn-sm btn-ghost">
         Login
        </NavLink>
        <NavLink to="/register" className="btn btn-sm btn-ghost">
         Register
        </NavLink>
        <NavLink to="/about" className="btn btn-sm btn-ghost">
          À propos
        </NavLink>
      </div>
    </div>
  );
};

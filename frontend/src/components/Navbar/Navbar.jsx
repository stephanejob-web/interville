import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';

export const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Interville
        </Link>

        <ul className="navbar-menu">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              Accueil
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              À propos
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

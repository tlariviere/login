import React from "react";
import { NavLink } from "react-router-dom";

import type { WithChildrenProps } from "../utils/types";
import SignOut from "./SignOut";
import "./Header.scss";

interface NavItemProps extends WithChildrenProps {
  to: string;
}

const NavPage: React.FC<NavItemProps> = ({ children, to }) => (
  <li className="nav-item">
    <NavLink to={to} className="nav-link">
      {children}
    </NavLink>
  </li>
);

const NavButton: React.FC<NavItemProps> = ({ children, to }) => (
  <NavLink to={to} className="DarkButton" role="button">
    {children}
  </NavLink>
);

const NavToggler: React.FC<{ target: string }> = ({ target }) => (
  <button
    className="navbar-toggler ms-auto"
    type="button"
    data-bs-toggle="collapse"
    data-bs-target={target}
  >
    <span className="navbar-toggler-icon" />
  </button>
);

const NavBrand = () => (
  <NavLink to="/" className="navbar-brand">
    App
  </NavLink>
);

const NavPages: React.FC<{ isAdmin: boolean }> = ({ isAdmin }) => (
  <ul className="navbar-nav">
    <NavPage to="/user">Your profile</NavPage>
    {isAdmin && <NavPage to="/admin">Admin</NavPage>}
  </ul>
);

const NavSignActions: React.FC<{ isSignedIn: boolean }> = ({ isSignedIn }) => (
  <ul className="navbar-nav ms-auto">
    {isSignedIn ? (
      <li className="nav-item">
        <SignOut />
      </li>
    ) : (
      <div className="nav-item btn-group" role="group">
        <NavButton to="/sign-in">Sign in</NavButton>
        <NavButton to="/sign-up">Sign up</NavButton>
      </div>
    )}
  </ul>
);

interface HeaderProps {
  isSignedIn: boolean;
  isAdmin: boolean;
}

const Header: React.FC<HeaderProps> = ({ isSignedIn, isAdmin }) => (
  <header className="Header">
    <nav>
      <div className="container">
        <NavBrand />
        <NavToggler target="#headerNav" />
        <div className="navbar-collapse collapse" id="headerNav">
          {isSignedIn && <NavPages isAdmin={isAdmin} />}
          <NavSignActions isSignedIn={isSignedIn} />
        </div>
      </div>
    </nav>
  </header>
);

export default Header;

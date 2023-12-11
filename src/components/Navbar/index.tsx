import { NavLink } from "react-router-dom";
import "./styles.css";
import Logo from "assets/images/logo-no-background.svg";
import { useEffect, useRef } from "react";

const Navbar = () => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const handleMenuToggle = () => {
    let menu = menuRef.current;

    if (menu) {
      // menu.style.display =
      // menu.style.display === "flex" ? "none" : "flex";

      menu.classList.toggle("open");
    }
  };

  useEffect(() => {
    const menu = menuRef.current;

    if (window.innerWidth < 768 && menu) {
      menu.classList.toggle("open");
    }
  }, []);

  return (
    <nav className="custom-navbar" id="navbar">
      <NavLink to={"/"}>
        <img className="nav-logo" src={Logo} alt="Logotipo Money Master" />
      </NavLink>
      <div
        className="navbar-subcontainer"
        id="navbar-subcontainer"
        ref={menuRef}
      >
        <ul className="navbar-item-list">
          <NavLink to={"/"}>
            <li className="nav-item">Home</li>
          </NavLink>
          <NavLink to={"/"}>
            <li className="nav-item">Wishlists</li>
          </NavLink>
          <NavLink to={"/"}>
            <li className="nav-item">Expense Track</li>
          </NavLink>
          <NavLink to={"/"}>
            <li className="nav-item">Login</li>
          </NavLink>
        </ul>
        <hr className="nav-divisor" />
        <button type="button" className="theme-button" id="theme-button">
          <i className="bi bi-lightbulb-fill" />
        </button>
      </div>
      <button
        onClick={handleMenuToggle}
        type="button"
        className="menu-button"
        id="menu-button"
        ref={buttonRef}
      >
        <i className="bi bi-three-dots-vertical" />
      </button>
    </nav>
  );
};

export default Navbar;

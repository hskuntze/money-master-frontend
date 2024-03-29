import { NavLink, useNavigate } from "react-router-dom";
import "./styles.css";
import Logo from "assets/images/logo-no-background.svg";
import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "AuthContext";
import { getTokenData, isAuthenticated } from "util/auth";
import { removeAuthData, removeUserData } from "util/storage";
import { ThemeContext } from "ThemeContext";

const Navbar = () => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { authContextData, setAuthContextData } = useContext(AuthContext);
  const { themeContextData, setThemeContextData } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleMenuToggle = () => {
    let menu = menuRef.current;

    if (menu) {
      menu.classList.toggle("open");
    }
  };

  const handleThemeToggle = () => {
    setThemeContextData({
      theme: themeContextData.theme === "light" ? "dark" : "light",
    });

    const root = document.getElementById("root") as HTMLDivElement;

    if (themeContextData.theme === "light") {
      root.style.backgroundColor = "#434343";
    } else {
      root.style.backgroundColor = "#F2F0F2";
    }
  };

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    removeAuthData();
    removeUserData();

    setAuthContextData({
      authenticated: false,
    });

    navigate("/auth");
  };

  useEffect(() => {
    const menu = menuRef.current;

    if (window.innerWidth < 768 && menu) {
      menu.classList.toggle("open");
    }

    let auth = isAuthenticated();
    if (auth) {
      setAuthContextData({
        authenticated: auth,
        tokenData: getTokenData(),
      });
    } else {
      setAuthContextData({
        authenticated: auth,
        tokenData: undefined,
      });
    }
  }, [setAuthContextData]);

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
          <NavLink to={"/wishlists"}>
            <li className="nav-item">Wishlists</li>
          </NavLink>
          <NavLink to={"/expensetrack"}>
            <li className="nav-item">Expense Track</li>
          </NavLink>
          {authContextData.authenticated ? (
            <a href="logout" onClick={handleLogout}>
              <li className="nav-item logout-item">Logout</li>
            </a>
          ) : (
            <NavLink to={"/auth"}>
              <li className="nav-item">Login</li>
            </NavLink>
          )}
        </ul>
        <hr className="nav-divisor" />
        <button
          type="button"
          className="theme-button"
          id="theme-button"
          onClick={handleThemeToggle}
        >
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

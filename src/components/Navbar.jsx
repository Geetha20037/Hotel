
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Compass, CalendarCheck } from "lucide-react";
import { getBookings } from "../utils/storage";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingCount, setBookingCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const refresh = () => {
      setBookingCount(
        getBookings().filter((booking) => booking.status === "Confirmed").length
      );
    };

    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("stayora-bookings-updated", refresh);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("stayora-bookings-updated", refresh);
    };
  }, [location.pathname]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { label: "Discover", to: "/" },
    { label: "Explore stays", to: "/hotels" },
    { label: "My bookings", to: "/my-bookings" }
  ];

  return (
    <header className="site-header">
      <nav className="navbar container">
        <Link to="/" className="brand" aria-label="STAYORA home">
          <span className="brand-mark"><Compass size={22} /></span>
          <span>stayora<span className="brand-period">.</span></span>
        </Link>

        <div className={`nav-links ${menuOpen ? "nav-links-open" : ""}`}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              {item.label}
              {item.to === "/my-bookings" && bookingCount > 0 && (
                <span className="nav-count">{bookingCount}</span>
              )}
            </NavLink>
          ))}
          <Link to="/hotels" className="button button-dark nav-cta">
            Find a stay <span>↗</span>
          </Link>
        </div>

        <button
          className="mobile-menu-button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </nav>
    </header>
  );
}

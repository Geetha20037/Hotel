
import { Link } from "react-router-dom";
import { Compass, Instagram, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand">
            <Link to="/" className="brand footer-logo">
              <span className="brand-mark"><Compass size={22} /></span>
              <span>stayora<span className="brand-period">.</span></span>
            </Link>
            <p>For the places that stay with you.</p>
            <span className="footer-social"><Instagram size={17} /> Travel beautifully.</span>
          </div>

          <div className="footer-column">
            <h4>Explore</h4>
            <Link to="/hotels">All stays</Link>
            <Link to="/hotels?destination=Goa">Beach escapes</Link>
            <Link to="/hotels?destination=Manali">Mountain stays</Link>
          </div>

          <div className="footer-column">
            <h4>Your journey</h4>
            <Link to="/my-bookings">My bookings</Link>
            <Link to="/hotels">Find a hotel</Link>
            <a href="mailto:hello@stayora.example">Contact us <ArrowUpRight size={13} /></a>
          </div>

          <div className="footer-note">
            <span className="eyebrow">A LITTLE MORE AWAY</span>
            <h3>Find your<br />somewhere.</h3>
            <Link to="/hotels" className="footer-explore">Explore stays ↗</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} STAYORA. All rights reserved.</span>
          <span>Made for meaningful getaways.</span>
        </div>
      </div>
    </footer>
  );
}


import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUpRight, Sparkles, ShieldCheck, HeartHandshake, MapPin } from "lucide-react";
import { hotels, destinations } from "../data/hotels";
import SearchBar from "../components/SearchBar";
import HotelCard from "../components/HotelCard";

export default function Home() {
  return (
    <main>
      <section className="hero">
        <img
          className="hero-background"
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2200&q=90"
          alt="Beautiful luxury resort surrounded by tropical greenery"
        />
        <div className="hero-overlay" />

        <div className="container hero-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="hero-kicker"><span /> YOUR NEXT CHAPTER STARTS HERE</div>
            <h1>Find your<br /> <em>somewhere.</em></h1>
            <p className="hero-description">
              Thoughtful stays. Remarkable places.<br className="desktop-break" />
              Beautiful memories waiting to happen.
            </p>
            <div className="hero-actions">
              <Link to="/hotels" className="button button-light">Explore stays <ArrowUpRight size={17} /></Link>
              <a href="#featured" className="hero-text-link">Discover our collection <ArrowDown size={15} /></a>
            </div>
          </motion.div>

          <div className="hero-side-note">
            <span className="hero-side-line" />
            <span>CURATED FOR THE CURIOUS</span>
          </div>
        </div>

        <div className="container hero-bottom">
          <span><MapPin size={14} /> Discover stays across India</span>
          <span>01 — YOUR JOURNEY BEGINS</span>
        </div>
      </section>

      <section className="search-section">
        <div className="container">
          <div className="search-intro">
            <span className="eyebrow">MAKE YOURSELF AT HOME</span>
            <h2>Your next escape, <em>starts here.</em></h2>
          </div>
          <SearchBar />
          <div className="search-trust-row">
            <span><ShieldCheck size={15} /> Simple, transparent pricing</span>
            <span><HeartHandshake size={15} /> Handpicked stays</span>
            <span><Sparkles size={15} /> Memorable experiences</span>
          </div>
        </div>
      </section>

      <section className="section featured-section" id="featured">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">A FEW PLACES WE LOVE</span>
              <h2>Stays worth <em>the journey.</em></h2>
              <p>Distinctive places for the moments that matter.</p>
            </div>
            <Link to="/hotels" className="text-link">View all stays <ArrowRight size={17} /></Link>
          </div>

          <div className="hotel-grid">
            {hotels.slice(0, 3).map((hotel, index) => (
              <HotelCard key={hotel.id} hotel={hotel} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="section destination-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">GO WHERE YOU FEEL</span>
              <h2>Places with a <em>certain feeling.</em></h2>
              <p>From salty air to mountain mornings, find your kind of away.</p>
            </div>
          </div>

          <div className="destination-grid">
            {destinations.map((destination, index) => (
              <motion.div
                className={`destination-card destination-card-${index + 1}`}
                key={destination.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
              >
                <img src={destination.image} alt={`${destination.name} destination`} loading="lazy" />
                <div className="destination-overlay" />
                <div className="destination-content">
                  <span>{destination.count}</span>
                  <h3>{destination.name}</h3>
                  <p>{destination.country}</p>
                </div>
                <Link
                  to={`/hotels?destination=${encodeURIComponent(destination.name)}`}
                  className="destination-arrow"
                  aria-label={`Explore hotels in ${destination.name}`}
                >
                  <ArrowUpRight size={20} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="manifesto-section">
        <div className="container manifesto-inner">
          <span className="eyebrow">NOT JUST A PLACE TO SLEEP</span>
          <h2>It's how a place<br />makes you <em>feel.</em></h2>
          <p>We believe the right stay can turn an ordinary trip into a story you'll tell for years.</p>
          <Link to="/hotels" className="button button-light">Find your stay <ArrowUpRight size={17} /></Link>
          <span className="manifesto-decoration">S.</span>
        </div>
      </section>
    </main>
  );
}

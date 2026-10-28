
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Star, ArrowUpRight, Wifi } from "lucide-react";
import { formatCurrency } from "../utils/pricing";

export default function HotelCard({ hotel, index = 0 }) {
  return (
    <motion.article
      className="hotel-card"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.3) }}
    >
      <Link to={`/hotels/${hotel.id}`} className="hotel-card-image-link" aria-label={`View ${hotel.name}`}>
        <div className="hotel-card-image-wrap">
          <img src={hotel.image} alt={hotel.name} className="hotel-card-image" loading="lazy" />
          <span className="hotel-category">{hotel.category}</span>
          <span className="hotel-image-arrow"><ArrowUpRight size={19} /></span>
        </div>
      </Link>

      <div className="hotel-card-content">
        <div className="hotel-card-heading">
          <div>
            <h3><Link to={`/hotels/${hotel.id}`}>{hotel.name}</Link></h3>
            <p className="hotel-location"><MapPin size={14} /> {hotel.location}</p>
          </div>
          <div className="rating-chip"><Star size={14} fill="currentColor" /> {hotel.rating.toFixed(1)}</div>
        </div>

        <div className="hotel-card-bottom">
          <div className="hotel-card-meta">
            <span><Wifi size={14} /> Wi-Fi</span>
            <span>{hotel.reviews} reviews</span>
          </div>
          <div className="hotel-price">
            <span className="hotel-old-price">{formatCurrency(hotel.oldPrice)}</span>
            <div><strong>{formatCurrency(hotel.price)}</strong><span> / night</span></div>
          </div>
        </div>

        <Link to={`/hotels/${hotel.id}`} className="hotel-card-link">
          View property <ArrowUpRight size={15} />
        </Link>
      </div>
    </motion.article>
  );
}

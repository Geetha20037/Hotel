
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Check, MapPin, Star, Wifi, Users, BedDouble, ShieldCheck, Minus, Plus } from "lucide-react";
import { hotels } from "../data/hotels";
import { calculatePrice, formatCurrency, getNightCount } from "../utils/pricing";

function getTomorrow() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function getToday() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function HotelDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const hotel = hotels.find((item) => item.id === id);

  const [selectedRoom, setSelectedRoom] = useState(hotel?.rooms[0]?.id || "");
  const [checkIn, setCheckIn] = useState(searchParams.get("checkIn") || getToday());
  const [checkOut, setCheckOut] = useState(searchParams.get("checkOut") || getTomorrow());
  const [guests, setGuests] = useState(Math.max(1, Number(searchParams.get("guests")) || 2));
  const [rooms, setRooms] = useState(Math.max(1, Number(searchParams.get("rooms")) || 1));
  const [dateError, setDateError] = useState("");

  const room = hotel?.rooms.find((item) => item.id === selectedRoom) || hotel?.rooms[0];
  const nights = getNightCount(checkIn, checkOut);

  const pricing = useMemo(
    () => room ? calculatePrice(room.price, nights, rooms) : null,
    [room, nights, rooms]
  );

  if (!hotel) {
    return (
      <main className="container page-content">
        <div className="empty-state">
          <h2>We couldn't find that stay.</h2>
          <p>This property may no longer be available in our sample collection.</p>
          <Link to="/hotels" className="button button-dark">Explore all stays</Link>
        </div>
      </main>
    );
  }

  function continueToBooking() {
    if (!checkIn || !checkOut || checkIn < getToday() || checkOut <= checkIn) {
      setDateError("Please select a valid check-in and check-out date.");
      return;
    }

    if (guests > room.capacity * rooms) {
      setDateError(`This room accommodates up to ${room.capacity} guest${room.capacity === 1 ? "" : "s"} per room. Add rooms or select a larger room.`);
      return;
    }

    setDateError("");
    const params = new URLSearchParams({
      room: room.id,
      checkIn,
      checkOut,
      guests: String(guests),
      rooms: String(rooms)
    });

    navigate(`/booking/${hotel.id}?${params.toString()}`);
  }

  return (
    <main className="details-page">
      <div className="container details-breadcrumb">
        <Link to="/hotels"><ArrowLeft size={15} /> All stays</Link>
        <span>/</span><span>{hotel.name}</span>
      </div>

      <section className="container details-heading">
        <div>
          <span className="eyebrow">{hotel.category.toUpperCase()} COLLECTION</span>
          <h1>{hotel.name}</h1>
          <div className="details-meta">
            <span><MapPin size={15} /> {hotel.location}</span>
            <span><Star size={15} fill="currentColor" /> {hotel.rating} <span className="muted">({hotel.reviews} reviews)</span></span>
          </div>
        </div>
        <span className="details-badge"><ShieldCheck size={16} /> Thoughtfully selected</span>
      </section>

      <section className="container details-gallery">
        <div className="gallery-main">
          <img src={hotel.images[0]} alt={`${hotel.name} main view`} />
        </div>
        <div className="gallery-side">
          <img src={hotel.images[1]} alt={`${hotel.name} room and interiors`} />
          <img src={hotel.images[2]} alt={`${hotel.name} amenities and surroundings`} />
        </div>
      </section>

      <section className="container details-content">
        <div className="details-main-column">
          <div className="details-intro">
            <span className="eyebrow">THE EXPERIENCE</span>
            <h2>A stay that feels <em>like yours.</em></h2>
            <p>{hotel.description}</p>
            <div className="details-highlights">
              <div><span className="highlight-icon"><Wifi size={19} /></span><strong>Stay connected</strong><span>Complimentary Wi-Fi</span></div>
              <div><span className="highlight-icon"><Star size={19} /></span><strong>Guest-loved</strong><span>{hotel.rating}/5 guest rating</span></div>
              <div><span className="highlight-icon"><ShieldCheck size={19} /></span><strong>Peace of mind</strong><span>Clear price breakdown</span></div>
            </div>
          </div>

          <div className="amenities-section">
            <span className="eyebrow">MADE FOR YOUR COMFORT</span>
            <h2>Thoughtful <em>amenities.</em></h2>
            <div className="amenities-grid">
              {hotel.amenities.map((amenity) => (
                <div key={amenity} className="amenity-item"><Check size={16} /> {amenity}</div>
              ))}
            </div>
          </div>

          <div className="room-selection-section">
            <span className="eyebrow">CHOOSE YOUR SPACE</span>
            <h2>Rooms & <em>suites.</em></h2>

            <div className="room-list">
              {hotel.rooms.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={`room-option ${selectedRoom === item.id ? "room-option-selected" : ""}`}
                  onClick={() => { setSelectedRoom(item.id); setDateError(""); }}
                >
                  <span className="room-radio">{selectedRoom === item.id && <span />}</span>
                  <span className="room-icon"><BedDouble size={23} /></span>
                  <span className="room-description">
                    <strong>{item.name}</strong>
                    <span>{item.beds}</span>
                    <small><Users size={13} /> Up to {item.capacity} guests per room</small>
                  </span>
                  <span className="room-price"><strong>{formatCurrency(item.price)}</strong><small>/ night</small></span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <aside className="booking-sidebar">
          <div className="booking-card">
            <span className="eyebrow">MAKE IT YOURS</span>
            <div className="booking-price"><strong>{formatCurrency(room.price)}</strong><span> / night</span></div>
            <div className="booking-review"><Star size={14} fill="currentColor" /> {hotel.rating} <span>· {hotel.reviews} reviews</span></div>

            <div className="booking-date-fields">
              <label>CHECK IN<input type="date" min={getToday()} value={checkIn} onChange={(e) => { setCheckIn(e.target.value); setDateError(""); }} /></label>
              <label>CHECK OUT<input type="date" min={checkIn || getToday()} value={checkOut} onChange={(e) => { setCheckOut(e.target.value); setDateError(""); }} /></label>
            </div>

            <div className="booking-guest-control">
              <div><strong>Guests</strong><small>Travelers</small></div>
              <div className="counter-controls">
                <button type="button" aria-label="Remove guest" disabled={guests <= 1} onClick={() => { setGuests((n) => Math.max(1, n - 1)); setDateError(""); }}><Minus size={14} /></button>
                <span>{guests}</span>
                <button type="button" aria-label="Add guest" disabled={guests >= 12} onClick={() => { setGuests((n) => Math.min(12, n + 1)); setDateError(""); }}><Plus size={14} /></button>
              </div>
            </div>

            <div className="booking-guest-control">
              <div><strong>Rooms</strong><small>Rooms required</small></div>
              <div className="counter-controls">
                <button type="button" aria-label="Remove room" disabled={rooms <= 1} onClick={() => { setRooms((n) => Math.max(1, n - 1)); setDateError(""); }}><Minus size={14} /></button>
                <span>{rooms}</span>
                <button type="button" aria-label="Add room" disabled={rooms >= 6} onClick={() => { setRooms((n) => Math.min(6, n + 1)); setDateError(""); }}><Plus size={14} /></button>
              </div>
            </div>

            <div className="price-breakdown">
              <div><span>{formatCurrency(room.price)} × {nights} night{nights !== 1 ? "s" : ""} × {rooms} room{rooms !== 1 ? "s" : ""}</span><span>{formatCurrency(pricing.subtotal)}</span></div>
              <div><span>Taxes & fees (12%)</span><span>{formatCurrency(pricing.taxes)}</span></div>
              <div className="price-total"><strong>Total estimate</strong><strong>{formatCurrency(pricing.total)}</strong></div>
            </div>

            {dateError && <p className="form-error">{dateError}</p>}
            <button type="button" onClick={continueToBooking} className="button button-dark booking-continue">Continue to booking <ArrowUpRight size={17} /></button>
            <p className="booking-disclaimer">No payment is collected. This is a frontend demo.</p>
          </div>
        </aside>
      </section>
    </main>
  );
}

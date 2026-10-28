
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { hotels } from "../data/hotels";
import { addBooking } from "../utils/storage";
import { calculatePrice, formatCurrency, getNightCount } from "../utils/pricing";

function todayString() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function Booking() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const hotel = hotels.find((item) => item.id === id);

  const checkIn = params.get("checkIn") || "";
  const checkOut = params.get("checkOut") || "";
  const guests = Math.max(1, Number(params.get("guests")) || 1);
  const rooms = Math.max(1, Number(params.get("rooms")) || 1);
  const room = hotel?.rooms.find((item) => item.id === params.get("room")) || hotel?.rooms[0];

  const nights = getNightCount(checkIn, checkOut);
  const pricing = useMemo(
    () => room ? calculatePrice(room.price, nights, rooms) : null,
    [room, nights, rooms]
  );

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    requests: ""
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (!hotel || !room || !checkIn || !checkOut || checkIn < todayString() || checkOut <= checkIn) {
    return (
      <main className="container page-content">
        <div className="empty-state">
          <h2>Your booking details are incomplete.</h2>
          <p>Choose a hotel, room, and valid dates before continuing.</p>
          <Link to="/hotels" className="button button-dark">Explore stays</Link>
        </div>
      </main>
    );
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  }

  function validate() {
    const next = {};

    if (form.fullName.trim().length < 2) next.fullName = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "Enter a valid email address.";
    if (!/^[0-9+()\-\s]{7,18}$/.test(form.phone.trim())) next.phone = "Enter a valid phone number.";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!validate() || submitting) return;

    setSubmitting(true);

    const bookingId = `STY-${Date.now().toString().slice(-8)}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
    const booking = {
      bookingId,
      hotelId: hotel.id,
      hotelName: hotel.name,
      hotelLocation: hotel.location,
      hotelImage: hotel.image,
      roomId: room.id,
      roomName: room.name,
      checkIn,
      checkOut,
      nights,
      guests,
      rooms,
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      requests: form.requests.trim(),
      subtotal: pricing.subtotal,
      taxes: pricing.taxes,
      total: pricing.total,
      status: "Confirmed",
      createdAt: new Date().toISOString()
    };

    try {
      addBooking(booking);
      window.dispatchEvent(new Event("stayora-bookings-updated"));
      navigate(`/booking-confirmation/${bookingId}`, { replace: true });
    } catch {
      setErrors({ submit: "Unable to save your booking. Please check your browser storage and try again." });
      setSubmitting(false);
    }
  }

  return (
    <main className="checkout-page">
      <div className="container checkout-container">
        <Link to={`/hotels/${hotel.id}`} className="back-link"><ArrowLeft size={16} /> Back to property</Link>

        <div className="checkout-heading">
          <span className="eyebrow">ONE STEP CLOSER</span>
          <h1>Let's make it <em>official.</em></h1>
          <p>Your next getaway is just a few details away.</p>
        </div>

        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={handleSubmit} noValidate>
            <div className="checkout-form-section">
              <span className="step-label">01 / YOUR DETAILS</span>
              <h2>Who's checking in?</h2>
              <p>Enter the details of the primary guest for this reservation.</p>

              <div className="form-field">
                <label htmlFor="fullName">Full name *</label>
                <input id="fullName" name="fullName" autoComplete="name" value={form.fullName} onChange={updateField} placeholder="Enter your full name" />
                {errors.fullName && <span className="field-error">{errors.fullName}</span>}
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="email">Email address *</label>
                  <input id="email" name="email" type="email" autoComplete="email" value={form.email} onChange={updateField} placeholder="you@example.com" />
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>
                <div className="form-field">
                  <label htmlFor="phone">Phone number *</label>
                  <input id="phone" name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={updateField} placeholder="+91 98765 43210" />
                  {errors.phone && <span className="field-error">{errors.phone}</span>}
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="requests">Special requests <span className="optional-label">Optional</span></label>
                <textarea id="requests" name="requests" rows="3" value={form.requests} onChange={updateField} placeholder="Any preferences you'd like us to know about?" maxLength={500} />
              </div>
            </div>

            <div className="checkout-form-section booking-summary-dates">
              <span className="step-label">02 / YOUR STAY</span>
              <h2>Double-check the details.</h2>
              <div className="summary-date-grid">
                <div><span>CHECK IN</span><strong>{checkIn}</strong></div>
                <div><span>CHECK OUT</span><strong>{checkOut}</strong></div>
                <div><span>GUESTS</span><strong>{guests}</strong></div>
                <div><span>ROOMS</span><strong>{rooms}</strong></div>
              </div>
              <p className="summary-room-name">{room.name} · {nights} night{nights !== 1 ? "s" : ""}</p>
            </div>

            {errors.submit && <p className="form-error">{errors.submit}</p>}

            <button type="submit" className="button button-dark checkout-submit" disabled={submitting}>
              {submitting ? "Confirming your stay..." : "Confirm booking"}
              {!submitting && <ArrowRight size={17} />}
            </button>
            <p className="checkout-small-note"><ShieldCheck size={15} /> Demo booking only. No payment details required.</p>
          </form>

          <aside className="checkout-sidebar">
            <div className="checkout-property-image">
              <img src={hotel.image} alt={hotel.name} />
            </div>
            <div className="checkout-property-info">
              <span className="eyebrow">{hotel.category}</span>
              <h3>{hotel.name}</h3>
              <p>{hotel.hotelLocation || hotel.location}</p>
              <div className="checkout-room-label">{room.name}</div>
            </div>

            <div className="checkout-price-list">
              <div><span>{formatCurrency(room.price)} × {nights} nights × {rooms} rooms</span><strong>{formatCurrency(pricing.subtotal)}</strong></div>
              <div><span>Taxes & fees (12%)</span><strong>{formatCurrency(pricing.taxes)}</strong></div>
              <div className="checkout-total"><span>Total amount</span><strong>{formatCurrency(pricing.total)}</strong></div>
            </div>
            <div className="checkout-assurance"><CheckCircle2 size={18} /><span><strong>Transparent pricing</strong><small>Your full estimated cost is shown before confirming.</small></span></div>
          </aside>
        </div>
      </div>
    </main>
  );
}

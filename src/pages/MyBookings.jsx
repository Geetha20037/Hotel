
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, MapPin, Users, ArrowUpRight, XCircle, Luggage, Clock3 } from "lucide-react";
import { cancelBooking, getBookings } from "../utils/storage";
import { formatCurrency } from "../utils/pricing";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("All stays");
  const [cancelTarget, setCancelTarget] = useState(null);

  function refreshBookings() {
    setBookings(getBookings());
  }

  useEffect(() => {
    refreshBookings();
    window.addEventListener("storage", refreshBookings);
    window.addEventListener("stayora-bookings-updated", refreshBookings);

    return () => {
      window.removeEventListener("storage", refreshBookings);
      window.removeEventListener("stayora-bookings-updated", refreshBookings);
    };
  }, []);

  const visibleBookings = bookings.filter((booking) => {
    if (activeTab === "Upcoming") return booking.status === "Confirmed";
    if (activeTab === "Cancelled") return booking.status === "Cancelled";
    return true;
  });

  function confirmCancellation() {
    if (!cancelTarget) return;

    cancelBooking(cancelTarget.bookingId);
    setCancelTarget(null);
    refreshBookings();
    window.dispatchEvent(new Event("stayora-bookings-updated"));
  }

  return (
    <main className="bookings-page">
      <section className="bookings-banner">
        <div className="container bookings-banner-inner">
          <div>
            <span className="eyebrow">YOUR PERSONAL TRAVEL JOURNAL</span>
            <h1>Every journey<br />has a <em>story.</em></h1>
            <p>Your stays, your plans, all in one place.</p>
          </div>
          <div className="bookings-illustration"><Luggage size={65} strokeWidth={1} /><span>YOUR NEXT CHAPTER</span></div>
        </div>
      </section>

      <section className="container bookings-content">
        <div className="bookings-toolbar">
          <div>
            <span className="eyebrow">YOUR COLLECTION</span>
            <h2>My bookings <span className="bookings-count">{bookings.length}</span></h2>
          </div>
          <Link to="/hotels" className="button button-dark">Find another stay <ArrowUpRight size={16} /></Link>
        </div>

        <div className="booking-tabs" role="tablist" aria-label="Filter bookings">
          {["All stays", "Upcoming", "Cancelled"].map((tab) => (
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              key={tab}
              className={activeTab === tab ? "booking-tab active" : "booking-tab"}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              {tab === "All stays" && <span>{bookings.length}</span>}
              {tab === "Upcoming" && <span>{bookings.filter((b) => b.status === "Confirmed").length}</span>}
              {tab === "Cancelled" && <span>{bookings.filter((b) => b.status === "Cancelled").length}</span>}
            </button>
          ))}
        </div>

        {visibleBookings.length === 0 ? (
          <div className="bookings-empty">
            <div className="empty-icon"><CalendarDays size={30} /></div>
            <span className="eyebrow">A LITTLE SPACE FOR SOMETHING NEW</span>
            <h3>{bookings.length === 0 ? "Your next story starts here." : `No ${activeTab.toLowerCase()} yet.`}</h3>
            <p>{bookings.length === 0 ? "You haven't booked a stay yet. Find somewhere beautiful and make it yours." : "There are no bookings in this category at the moment."}</p>
            <Link to="/hotels" className="button button-dark">Explore stays <ArrowUpRight size={16} /></Link>
          </div>
        ) : (
          <div className="my-bookings-list">
            {visibleBookings.map((booking) => (
              <article className={`my-booking-card ${booking.status === "Cancelled" ? "my-booking-cancelled" : ""}`} key={booking.bookingId}>
                <div className="my-booking-image"><img src={booking.hotelImage} alt={booking.hotelName} loading="lazy" /></div>
                <div className="my-booking-info">
                  <div className="my-booking-topline">
                    <span className={`status-pill ${booking.status === "Confirmed" ? "status-confirmed" : "status-cancelled"}`}>{booking.status}</span>
                    <span className="booking-reference">REF. {booking.bookingId}</span>
                  </div>
                  <h3>{booking.hotelName}</h3>
                  <p className="my-booking-location"><MapPin size={14} /> {booking.hotelLocation}</p>
                  <p className="my-booking-room">{booking.roomName}</p>
                  <div className="my-booking-facts">
                    <span><CalendarDays size={15} /> {booking.checkIn} – {booking.checkOut}</span>
                    <span><Clock3 size={15} /> {booking.nights} night{booking.nights !== 1 ? "s" : ""}</span>
                    <span><Users size={15} /> {booking.guests} guests · {booking.rooms} rooms</span>
                  </div>
                </div>
                <div className="my-booking-price">
                  <span>TOTAL</span>
                  <strong>{formatCurrency(booking.total)}</strong>
                  {booking.status === "Confirmed" && (
                    <button type="button" className="cancel-booking-button" onClick={() => setCancelTarget(booking)}>
                      <XCircle size={15} /> Cancel stay
                    </button>
                  )}
                  {booking.status === "Cancelled" && <span className="cancelled-label">Reservation cancelled</span>}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {cancelTarget && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setCancelTarget(null); }}>
          <section className="cancel-modal" role="dialog" aria-modal="true" aria-labelledby="cancel-title">
            <div className="cancel-modal-icon"><XCircle size={26} /></div>
            <span className="eyebrow">CHANGE OF PLANS?</span>
            <h2 id="cancel-title">Cancel this stay?</h2>
            <p>Your booking at <strong>{cancelTarget.hotelName}</strong> will be marked as cancelled in this demo.</p>
            <div className="cancel-modal-actions">
              <button type="button" className="button button-outline" onClick={() => setCancelTarget(null)}>Keep booking</button>
              <button type="button" className="button button-dark" onClick={confirmCancellation}>Yes, cancel</button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

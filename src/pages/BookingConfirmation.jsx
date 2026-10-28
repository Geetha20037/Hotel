
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, CalendarDays, MapPin, Users, ArrowRight, Download } from "lucide-react";
import { getBookingById } from "../utils/storage";
import { formatCurrency } from "../utils/pricing";

export default function BookingConfirmation() {
  const { bookingId } = useParams();
  const booking = getBookingById(bookingId);

  if (!booking) {
    return (
      <main className="container page-content">
        <div className="empty-state">
          <h2>Confirmation not found.</h2>
          <p>This booking may have been cleared from this browser.</p>
          <Link to="/my-bookings" className="button button-dark">View my bookings</Link>
        </div>
      </main>
    );
  }

  function downloadConfirmation() {
    const details = [
      "STAYORA — BOOKING CONFIRMATION",
      "--------------------------------",
      `Booking ID: ${booking.bookingId}`,
      `Status: ${booking.status}`,
      `Guest: ${booking.fullName}`,
      `Email: ${booking.email}`,
      `Hotel: ${booking.hotelName}`,
      `Location: ${booking.hotelLocation}`,
      `Room: ${booking.roomName}`,
      `Check-in: ${booking.checkIn}`,
      `Check-out: ${booking.checkOut}`,
      `Guests: ${booking.guests}`,
      `Rooms: ${booking.rooms}`,
      `Nights: ${booking.nights}`,
      `Subtotal: ${formatCurrency(booking.subtotal)}`,
      `Taxes: ${formatCurrency(booking.taxes)}`,
      `Total: ${formatCurrency(booking.total)}`,
      "",
      "Frontend demo confirmation. No payment was processed."
    ].join("\n");

    const file = new Blob([details], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${booking.bookingId}-confirmation.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="confirmation-page">
      <div className="container confirmation-container">
        <div className="confirmation-success-icon"><CheckCircle2 size={38} /></div>
        <span className="eyebrow">YOUR JOURNEY IS TAKING SHAPE</span>
        <h1>It's happening.<br /><em>You're going somewhere.</em></h1>
        <p className="confirmation-intro">Your sample booking has been saved successfully. All the details are right here.</p>

        <div className="confirmation-card">
          <div className="confirmation-card-header">
            <div><span>BOOKING REFERENCE</span><strong>{booking.bookingId}</strong></div>
            <span className={`status-pill ${booking.status === "Confirmed" ? "status-confirmed" : "status-cancelled"}`}>{booking.status}</span>
          </div>

          <div className="confirmation-property">
            <img src={booking.hotelImage} alt={booking.hotelName} />
            <div>
              <span className="eyebrow">YOUR STAY</span>
              <h2>{booking.hotelName}</h2>
              <p><MapPin size={14} /> {booking.hotelLocation}</p>
              <span className="confirmation-room">{booking.roomName}</span>
            </div>
          </div>

          <div className="confirmation-facts">
            <div><CalendarDays size={18} /><span>CHECK IN<strong>{booking.checkIn}</strong></span></div>
            <div><CalendarDays size={18} /><span>CHECK OUT<strong>{booking.checkOut}</strong></span></div>
            <div><Users size={18} /><span>GUESTS<strong>{booking.guests} guests · {booking.rooms} rooms</strong></span></div>
          </div>

          <div className="confirmation-total"><span>Total estimated amount</span><strong>{formatCurrency(booking.total)}</strong></div>

          <div className="confirmation-actions">
            <button type="button" className="button button-outline" onClick={downloadConfirmation}><Download size={16} /> Download details</button>
            <Link to="/my-bookings" className="button button-dark">My bookings <ArrowRight size={16} /></Link>
          </div>
        </div>

        <p className="confirmation-footnote">This is a browser-based demonstration. No real hotel reservation or payment has been made.</p>
      </div>
    </main>
  );
}

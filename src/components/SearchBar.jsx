
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, CalendarDays, Users, Search, Minus, Plus } from "lucide-react";

function localDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function SearchBar({ compact = false, initialValues = {} }) {
  const today = localDateString(new Date());
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrow = localDateString(tomorrowDate);

  const [destination, setDestination] = useState(initialValues.destination || "");
  const [checkIn, setCheckIn] = useState(initialValues.checkIn || today);
  const [checkOut, setCheckOut] = useState(initialValues.checkOut || tomorrow);
  const [guests, setGuests] = useState(Number(initialValues.guests) || 2);
  const [rooms, setRooms] = useState(Number(initialValues.rooms) || 1);
  const [guestOpen, setGuestOpen] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleCheckIn(value) {
    setCheckIn(value);
    if (value && checkOut <= value) {
      const next = new Date(`${value}T00:00:00`);
      next.setDate(next.getDate() + 1);
      setCheckOut(localDateString(next));
    }
  }

  function handleSearch(event) {
    event.preventDefault();

    if (!destination.trim()) {
      setError("Please enter a destination to explore.");
      return;
    }

    if (!checkIn || !checkOut || checkIn < today || checkOut <= checkIn) {
      setError("Choose valid check-in and check-out dates.");
      return;
    }

    setError("");
    setGuestOpen(false);

    const params = new URLSearchParams({
      destination: destination.trim(),
      checkIn,
      checkOut,
      guests: String(guests),
      rooms: String(rooms)
    });

    navigate(`/hotels?${params.toString()}`);
  }

  return (
    <form className={`search-panel ${compact ? "search-panel-compact" : ""}`} onSubmit={handleSearch}>
      <div className="search-field destination-field">
        <label htmlFor={compact ? "destination-compact" : "destination"}>
          <MapPin size={16} /> DESTINATION
        </label>
        <input
          id={compact ? "destination-compact" : "destination"}
          value={destination}
          onChange={(event) => setDestination(event.target.value)}
          placeholder="Where would you like to go?"
          autoComplete="off"
        />
      </div>

      <div className="search-divider" />

      <div className="search-field">
        <label htmlFor={compact ? "checkin-compact" : "checkin"}>
          <CalendarDays size={16} /> CHECK IN
        </label>
        <input
          id={compact ? "checkin-compact" : "checkin"}
          type="date"
          min={today}
          value={checkIn}
          onChange={(event) => handleCheckIn(event.target.value)}
          required
        />
      </div>

      <div className="search-divider" />

      <div className="search-field">
        <label htmlFor={compact ? "checkout-compact" : "checkout"}>
          <CalendarDays size={16} /> CHECK OUT
        </label>
        <input
          id={compact ? "checkout-compact" : "checkout"}
          type="date"
          min={checkIn ? (() => {
            const date = new Date(`${checkIn}T00:00:00`);
            date.setDate(date.getDate() + 1);
            return localDateString(date);
          })() : tomorrow}
          value={checkOut}
          onChange={(event) => setCheckOut(event.target.value)}
          required
        />
      </div>

      <div className="search-divider" />

      <div className="search-field guest-field">
        <label><Users size={16} /> GUESTS & ROOMS</label>
        <button
          type="button"
          className="guest-trigger"
          onClick={() => setGuestOpen((open) => !open)}
          aria-expanded={guestOpen}
        >
          {guests} guest{guests !== 1 ? "s" : ""}, {rooms} room{rooms !== 1 ? "s" : ""}
        </button>

        {guestOpen && (
          <div className="guest-popover">
            <div className="guest-counter">
              <div><strong>Guests</strong><small>Adults and children</small></div>
              <div className="counter-controls">
                <button type="button" aria-label="Remove guest" disabled={guests <= 1} onClick={() => setGuests((n) => Math.max(1, n - 1))}><Minus size={14} /></button>
                <span>{guests}</span>
                <button type="button" aria-label="Add guest" disabled={guests >= 12} onClick={() => setGuests((n) => Math.min(12, n + 1))}><Plus size={14} /></button>
              </div>
            </div>
            <div className="guest-counter">
              <div><strong>Rooms</strong><small>Rooms required</small></div>
              <div className="counter-controls">
                <button type="button" aria-label="Remove room" disabled={rooms <= 1} onClick={() => setRooms((n) => Math.max(1, n - 1))}><Minus size={14} /></button>
                <span>{rooms}</span>
                <button type="button" aria-label="Add room" disabled={rooms >= 6} onClick={() => setRooms((n) => Math.min(6, n + 1))}><Plus size={14} /></button>
              </div>
            </div>
            <button type="button" className="button button-dark guest-done" onClick={() => setGuestOpen(false)}>Done</button>
          </div>
        )}
      </div>

      <button type="submit" className="search-submit" aria-label="Search hotels">
        <Search size={20} />
        <span>Search</span>
      </button>

      {error && <p className="search-error">{error}</p>}
    </form>
  );
}

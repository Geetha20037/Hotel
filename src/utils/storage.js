
const BOOKINGS_KEY = "stayora-bookings";

export function getBookings() {
  try {
    const saved = localStorage.getItem(BOOKINGS_KEY);
    const bookings = saved ? JSON.parse(saved) : [];
    return Array.isArray(bookings) ? bookings : [];
  } catch {
    return [];
  }
}

export function saveBookings(bookings) {
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
}

export function addBooking(booking) {
  const bookings = getBookings();
  const updated = [booking, ...bookings];
  saveBookings(updated);
  return updated;
}

export function cancelBooking(bookingId) {
  const updated = getBookings().map((booking) =>
    booking.bookingId === bookingId
      ? { ...booking, status: "Cancelled" }
      : booking
  );

  saveBookings(updated);
  return updated;
}

export function getBookingById(bookingId) {
  return getBookings().find((booking) => booking.bookingId === bookingId);
}


export function getNightCount(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 1;

  const start = new Date(`${checkIn}T00:00:00`);
  const end = new Date(`${checkOut}T00:00:00`);
  const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

  return Math.max(1, nights);
}

export function calculatePrice(roomPrice, nights, rooms = 1) {
  const subtotal = roomPrice * nights * rooms;
  const taxes = Math.round(subtotal * 0.12);

  return {
    subtotal,
    taxes,
    total: subtotal + taxes
  };
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

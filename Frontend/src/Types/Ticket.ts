export interface Ticket {
  ticketId: number;
  seatId: number;
  screeningPriceId?: number | null;
  number?: number | null;
}

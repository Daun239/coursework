export interface Seat {
  seatId: number;
  rowNumber?: number | null;
  seatNumber?: number | null;
  hallId: number;
  seatCategoryId?: number | null;
}

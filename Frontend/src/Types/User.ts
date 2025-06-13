export interface User {
  employeeId: number | string;
  email: string;
  name: string;
  surname: string;
  cellNumber: string;
  cinemaId: number | string;
  employeePosition?: string; // Making this optional since we might not always have it
  role: string; // Adding role as a required field
  CinemaName: string;
  CityName: string;
}
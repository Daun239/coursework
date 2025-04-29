export default interface DecodedToken {
    employeeId: number;
    cinemaId: number;
    name: string;
    surname: string;
    cellNumber: string;
    email: string;
    role: string; // Assuming you have a role field in the JWT
  }
  
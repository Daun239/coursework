export interface Run {
    runId: number;
    movieId: number;
    startDate: string; // DateOnly can be represented as a string in TypeScript (ISO format)
    endDate: string;   // DateOnly can be represented as a string in TypeScript (ISO format)
  }
  
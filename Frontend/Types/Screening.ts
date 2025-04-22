export interface Screening {
    screeningId: number;
    screeningFormatId?: number | null;
    hallId: number;
    runId: number;
    languageId?: number | null;
    startDate: string;  // DateOnly as string (ISO format)
    startTime: string;  // TimeOnly as string (HH:mm:ss format)
    endTime: string;    // TimeOnly as string (HH:mm:ss format)
  }
  
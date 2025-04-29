export interface Movie {
    movieId: number;
    countryId?: number | null;
    ageRestrictionId?: number | null;
    publisherId?: number | null;
    languageId?: number | null;
    budget?: number | null;
    runtime?: number | null;
    name?: string | null;
    description?: string | null;
  }
  
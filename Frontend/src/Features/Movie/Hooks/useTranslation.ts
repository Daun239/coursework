import { useLanguageStore } from "@/Stores/useLanguageStore";

// Define the structure of our translations
type TranslationKeys = {
  // MoviePreview Component
  movie: {
    notFound: string;
    untitled: string;
    loading: string;
    publisher: string;
    language: string;
    country: string;
    description: string;
    budget: string;
    runtime: string;
    startDate: string;
    endDate: string;
    notAvailable: string;
  };

  // MovieList Component
  movieList: {
    moviesFound: string;
    filterByAgeRestrictions: string;
    filterByGenres: string;
    filterByCountries: string;
    filterByPublishers: string;
    filterByLanguage: string;
    searchPlaceholder: string;
    budget: string;
    runtime: string;
    itemsPerPage: string;
    availableScreenings: string;
    noScreenings: string;
    minutes: string;
    addScreening: string;
    addMovie: string;
    showNoScreeningsMovies: string;
  };
};

// Define the translations
const translations: Record<"en" | "ua", TranslationKeys> = {
  en: {
    movie: {
      notFound: "Movie not found",
      untitled: "Untitled Movie",
      loading: "Loading...",
      publisher: "Publisher",
      language: "Language",
      country: "Country",
      description: "Description",
      budget: "Budget",
      runtime: "Runtime",
      startDate: "Start Date",
      endDate: "End Date",
      notAvailable: "N/A",
    },
    movieList: {
      moviesFound: "movies found",
      filterByAgeRestrictions: "Filter by age restrictions",
      filterByGenres: "Filter by genres",
      filterByCountries: "Filter by countries",
      filterByPublishers: "Filter by publishers",
      filterByLanguage: "Filter by original language",
      searchPlaceholder: "Search movie title or description",
      budget: "Budget",
      runtime: "Runtime",
      itemsPerPage: "Items per page:",
      availableScreenings: "Available Screenings",
      noScreenings: "No screenings available",
      minutes: "minutes",
      addScreening: "Add screening",
      addMovie: "Add movie",
      showNoScreeningsMovies: "Show movies with no screenings",
    },
  },
  ua: {
    movie: {
      notFound: "Фільм не знайдено",
      untitled: "Фільм без назви",
      loading: "Завантаження...",
      publisher: "Видавець",
      language: "Мова",
      country: "Країна",
      description: "Опис",
      budget: "Бюджет",
      runtime: "Тривалість",
      startDate: "Дата початку",
      endDate: "Дата закінчення",
      notAvailable: "Н/Д",
    },
    movieList: {
      moviesFound: "фільмів знайдено",
      filterByAgeRestrictions: "Фільтр за віковими обмеженнями",
      filterByGenres: "Фільтр за жанрами",
      filterByCountries: "Фільтр за країнами",
      filterByPublishers: "Фільтр за видавцями",
      filterByLanguage: "Фільтр за мовою оригіналу",
      searchPlaceholder: "Пошук за назвою або описом фільму",
      budget: "Бюджет",
      runtime: "Тривалість",
      itemsPerPage: "Елементів на сторінці:",
      availableScreenings: "Доступні сеанси",
      noScreenings: "Немає доступних сеансів",
      minutes: "хвилин",
      addScreening: "Додати сеанс",
      addMovie: "Додати фільм",
      showNoScreeningsMovies: "Показувати фільми без сеансів",
    },
  },
};

// Hook to use translations

export const useTranslation = () => {
  const { language } = useLanguageStore();

  const t = (key: string) => {
    const keys = key.split(".");
    let translation: any = translations[language];

    for (const k of keys) {
      if (translation[k] === undefined) {
        console.warn(
          `Translation key "${key}" not found for language "${language}"`
        );
        return key;
      }
      translation = translation[k];
    }

    return translation;
  };

  return { t, language };
};

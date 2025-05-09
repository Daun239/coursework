import { useEffect, useState } from "react";
import { useServiceStore } from "../../../Stores/ServicesStore";
import { Genre } from "@/Types/Genre";
import { Run } from "@/Types/Run";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; // Updated import path for consistency
import fetchPosterFromTMDb from "@/Utils/fetchPosterFromImdb";
import { useTranslation } from "../Hooks/useTranslation";
import { toast } from "sonner";
import { useLanguageStore } from "@/Stores/useLanguageStore";

type Props = {
  movieId: number;
  onSelectMovieId: (movieId: number) => void;
  handleRerender: () => void;
};

const MoviePreview = ({ movieId, onSelectMovieId, handleRerender }: Props) => {
  const { t } = useTranslation(); // Use the translation hook
  const { movieService, ageRestrictionService, publisherService, languageService, countryService, moviesGenreService, genreService, runService } = useServiceStore();
  const [movieData, setMovieData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Store classifier information
  const [ageRestriction, setAgeRestriction] = useState("");
  const [publisher, setPublisher] = useState("");
  const [language1, setLanguage1] = useState("");
  const [country, setCountry] = useState("");
  const [genres, setGenres] = useState<Genre[]>([]);
  const [run, setRun] = useState<Run>();

  const [posterUrl, setPosterUrl] = useState<string | null>(null);

  // Translation constants for both English and Ukrainian
  const translations = {
    en: {
      edit: "Edit",
      delete: "Delete",
      deleteConfirmation: "Are you sure you want to delete this movie?",
      cancel: "Cancel",
      confirmDelete: "Delete",
      notFound: "Movie not found",
      untitled: "Untitled",
      publisher: "Publisher",
      language: "Language",
      country: "Country",
      description: "Description",
      budget: "Budget",
      runtime: "Runtime",
      startDate: "Start Date",
      endDate: "End Date",
      notAvailable: "N/A",
      deleteSuccess: "Movie deleted successfully",
      deleteError: "Failed to delete movie"
    },
    ua: {
      edit: "Редагувати",
      delete: "Видалити",
      deleteConfirmation: "Ви впевнені, що хочете видалити цей фільм?",
      cancel: "Скасувати",
      confirmDelete: "Видалити",
      notFound: "Фільм не знайдено",
      untitled: "Без назви",
      publisher: "Видавець",
      language: "Мова",
      country: "Країна",
      description: "Опис",
      budget: "Бюджет",
      runtime: "Тривалість",
      startDate: "Дата початку",
      endDate: "Дата закінчення",
      notAvailable: "Немає даних",
      deleteSuccess: "Фільм успішно видалено",
      deleteError: "Не вдалося видалити фільм"
    }
  };


  const { language } = useLanguageStore();

  const txt = translations[language];

  useEffect(() => {
    const fetchPoster = async () => {
      if (!movieData?.name) return;

      const poster = await fetchPosterFromTMDb(movieData.name);
      if (poster) {
        setPosterUrl(poster);
      }
    };

    fetchPoster();
  }, [movieData]);

  const handleDelete = async () => {
    try {
      // First delete related genres
      await moviesGenreService.delete(`movieId = ${movieId}`);
      // Then delete related runs
      if (run) {
        await runService.delete(`movieId = ${movieId}`);
      }

      // Finally delete the movie
      await movieService.delete(`movieId = ${movieId}`);

      toast.success(txt.deleteSuccess);

      // You might want to add some callback here to inform parent component
      // e.g., onMovieDeleted(movieId);

      handleRerender();
    } catch (error) {
      console.error("Error deleting movie:", error);
      toast.error(txt.deleteError);
    }
  };

  useEffect(() => {
    const fetchMovieAndClassifiers = async () => {
      setLoading(true);
      try {
        // Fetch movie data
        const fetchedData = await movieService.getAll(`MovieId = ${movieId}`, "", 1, 10);
        console.log("Movie data:", fetchedData);

        if (fetchedData.length > 0) {
          const movie = fetchedData[0];
          setMovieData(movie);

          // Fetch age restriction data if available
          if (movie.ageRestrictionId) {
            const ageRestrictionData = await ageRestrictionService.getAll(
              `AgeRestrictionId = ${movie.ageRestrictionId}`, "", 1, 1
            );

            console.log("ageRestriction", ageRestriction);
            if (ageRestrictionData.length > 0) {
              setAgeRestriction(String(ageRestrictionData[0].ageRestriction1));
            }
          }

          // Fetch publisher data if available
          if (movie.publisherId) {
            const publisherData = await publisherService.getAll(
              `PublisherId = ${movie.publisherId}`, "", 1, 1
            );
            if (publisherData.length > 0) {
              setPublisher(publisherData[0].publisher1 || String(movie.publisherId));
            }
          }

          // Fetch language data if available
          if (movie.languageId) {
            const [languageData] = await languageService.getAll(
              `LanguageId = ${movie.languageId}`, "", 1, 1
            );
            setLanguage1(languageData.language1 || String(movie.languageId));
          }

          // Fetch country data if available
          if (movie.countryId) {
            const countryData = await countryService.getAll(
              `CountryId = ${movie.countryId}`, "", 1, 1
            );
            if (countryData.length > 0) {
              setCountry(countryData[0].country1 || String(movie.countryId));
            }
          }

          const genresIds = await moviesGenreService.getAll(`movieId = ${movieId}`);

          const ids = genresIds.map(g => g.genreId); // [1, 2, 5]
          if (ids.length > 0) {
            const filter = `genreId in (${ids.join(',')})`;
            const genres = await genreService.getAll(filter);
            setGenres(genres);
          }

          const run = await runService.getAll(`movieId = ${movieId}`);
          if (run && run.length > 0) {
            setRun(run[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching movie and classifiers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieAndClassifiers();
  }, [movieId, movieService, ageRestrictionService, publisherService, languageService, countryService, moviesGenreService, genreService, runService,]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48 w-full bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400 text-lg font-medium">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  if (!movieData) {
    return (
      <div className="p-5 bg-gray-100 dark:bg-gray-800 rounded-lg text-red-500 dark:text-red-400 text-center">
        {txt.notFound}
      </div>
    );
  }

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden w-full max-w-md my-4 hover:shadow-lg transition-shadow duration-300">
      {/* Blurred and darkened background */}
      {posterUrl && (
        <div className="absolute inset-0 overflow-hidden">
          <div
            style={{ backgroundImage: `url(${posterUrl})` }}
            className="absolute inset-0 bg-cover bg-center blur-md brightness-50 scale-110"
          />
        </div>
      )}

      {/* Content container with semi-transparent background */}
      <div className="relative bg-white/90 dark:bg-gray-900/90 rounded-lg overflow-hidden">
        {/* Action buttons container */}
        <div className="absolute top-4 right-4 flex space-x-2 z-10">
          {/* Edit button */}
          <button
            onClick={() => onSelectMovieId(movieId)}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-md transition-colors duration-200 flex items-center justify-center"
          >
            {txt.edit}
          </button>

          {/* Delete button with confirmation popover */}
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md shadow-md transition-colors duration-200 flex items-center justify-center"
              >
                {txt.delete}
              </button>
            </PopoverTrigger>
            <PopoverContent className="p-4 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700">
              <div className="space-y-4">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {txt.deleteConfirmation}
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-md transition-colors"
                    onClick={() => document.activeElement?.blur()} // Closes popover
                  >
                    {txt.cancel}
                  </button>
                  <button
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors"
                    onClick={handleDelete}
                  >
                    {txt.confirmDelete}
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Movie poster */}
        {posterUrl && (
          <img
            src={posterUrl}
            alt={`${movieData.name || txt.untitled} poster`}
            className="w-full h-64 object-cover rounded-t-lg shadow-lg"
          />
        )}

        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white leading-tight">
              {movieData.name || txt.untitled}
            </h2>

            {ageRestriction && (
              <span className="bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">
                {ageRestriction}+
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {publisher && (
              <span className="text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-md">
                <strong>{txt.publisher}:</strong> {publisher}
              </span>
            )}
            {language && (
              <span className="text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-md">
                <strong>{txt.language}:</strong> {language}
              </span>
            )}
            {country && (
              <span className="text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-md">
                <strong>{txt.country}:</strong> {country}
              </span>
            )}
          </div>

          {movieData.description && (
            <HoverCard>
              <HoverCardTrigger>
                <div className="mb-4">
                  <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-1">
                    {txt.description}
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3 p-2 hover:bg-blue-100/50 dark:hover:bg-blue-900/30 rounded-md transition-colors cursor-pointer">
                    {movieData.description}
                  </p>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="shadow-xl p-4 max-w-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300">{movieData.description}</p>
              </HoverCardContent>
            </HoverCard>
          )}

          {genres && genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {genres.map((genre) => (
                <span
                  key={genre.genreId}
                  className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-md"
                >
                  {genre.genre1}
                </span>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800/70 p-4 rounded-lg">
            <div>
              <strong>{txt.budget}:</strong> {movieData.budget ? `$${movieData.budget.toLocaleString()}` : txt.notAvailable}
            </div>
            <div>
              <strong>{txt.runtime}:</strong> {movieData.runtime ? `${movieData.runtime} min` : txt.notAvailable}
            </div>
            <div>
              <strong>{txt.startDate}:</strong> {run?.startDate ? new Date(run.startDate).toLocaleDateString() : txt.notAvailable}
            </div>
            <div>
              <strong>{txt.endDate}:</strong> {run?.endDate ? new Date(run.endDate).toLocaleDateString() : txt.notAvailable}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviePreview;
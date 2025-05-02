import { useEffect, useState } from "react";
import { useServiceStore } from "../../../Stores/ServicesStore"
import React from "react";
import { Genre } from "@/Types/Genre";
import { Run } from "@/Types/Run";



import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import fetchPosterFromTMDb from "@/Utils/fetchPosterFromImdb";



type Props = {
  movieId: number;
};

const MoviePreview = ({ movieId }: Props) => {
  const { movieService, ageRestrictionService, publisherService, languageService, countryService, moviesGenreService, genreService, runService } = useServiceStore();
  const [movieData, setMovieData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Store classifier information
  const [ageRestriction, setAgeRestriction] = useState("");
  const [publisher, setPublisher] = useState("");
  const [language, setLanguage] = useState("");
  const [country, setCountry] = useState("");
  const [genres, setGenres] = useState<Genre[]>([]);
  const [run, setRun] = useState<Run>();


  const [posterUrl, setPosterUrl] = useState<string | null>(null);






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
              setPublisher(publisherData[0].publisher1 || publisherData[0].publisher1 || String(movie.publisherId));
            }
          }

          // Fetch language data if available
          if (movie.languageId) {
            const [languageData] = await languageService.getAll(
              `LanguageId = ${movie.languageId}`, "", 1, 1
            );
            setLanguage(languageData.language1 || languageData.language1 || String(movie.languageId));

          }

          // Fetch country data if available
          if (movie.countryId) {
            const countryData = await countryService.getAll(
              `CountryId = ${movie.countryId}`, "", 1, 1
            );
            if (countryData.length > 0) {
              setCountry(countryData[0].country1 || countryData[0].country1 || String(movie.countryId));
            }
          }

          const genresIds = await moviesGenreService.getAll(`movieId = ${movieId}`);

          const ids = genresIds.map(g => g.genreId); // [1, 2, 5]
          const filter = `genreId in (${ids.join(',')})`;

          const genres = await genreService.getAll(filter);

          setGenres(genres);


          const run = await runService.getAll(`movieId = ${movieId}`);
          if (run) {
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
  }, [movieId, movieService, ageRestrictionService, publisherService, languageService, countryService]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48 w-full bg-gray-100 rounded-lg text-gray-500 text-lg font-medium">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  if (!movieData) {
    return (
      <div className="p-5 bg-gray-100 rounded-lg text-red-500 text-center">
        Movie not found
      </div>
    );
  }

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden w-full max-w-md my-4 hover:scale-101">

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
      <div className="relative bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
        {posterUrl && (
          <img
            src={posterUrl}
            alt={`${movieData.name || 'Movie'} poster`}
            className="w-full h-64 object-cover rounded-t-lg shadow-xl"
          />
        )}

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">

            <h2 className="text-xl font-bold text-gray-800 dark:text-white leading-tight">
              {movieData.name || 'Untitled Movie'}
            </h2>

            {ageRestriction && (
              <span className="bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">
                {ageRestriction}+
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {publisher && (
              <span className="text-sm  bg-gray-200 dark:bg-gray-700  px-2 py-1 rounded">
                <strong>Publisher:</strong> {publisher}
              </span>
            )}
            {language && (
              <span className="text-sm  bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                <strong>Language:</strong> {language}
              </span>
            )}
            {country && (
              <span className="text-sm  bg-gray-200 dark:bg-gray-700  px-2 py-1 rounded">
                <strong>Country:</strong> {country}
              </span>
            )}
          </div>

          {movieData.description && (


            <HoverCard>
              <HoverCardTrigger>
                <div className="mb-3">
                  <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-1 hover:bg-blue-900">
                    Description
                  </h3>
                  <p
                    className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3"
                  >
                    {movieData.description}
                  </p>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="shadow-xl">
                {movieData.description}
              </HoverCardContent>
            </HoverCard>
          )}



          {genres && genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {genres.map((genre) => (
                <span
                  key={genre.genreId}
                  className="text-sm bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded"
                >
                  {genre.genre1}
                </span>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <div>
              <strong>Budget:</strong> {movieData.budget || 'N/A'}
            </div>
            <div>
              <strong>Runtime:</strong> {movieData.runtime || 'N/A'}
            </div>
            <div>
              <strong>Start Date:</strong> {run?.startDate || 'N/A'}
            </div>
            <div>
              <strong>End Date:</strong> {run?.endDate || 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};

export default MoviePreview;
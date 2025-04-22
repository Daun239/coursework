import React, { useEffect, useState } from 'react';
import { useServiceStore } from '../Stores/ServicesStore';
import { Movie as MovieType } from '../Types/Movie';
import { useNavigate } from 'react-router-dom';
import { Genre } from "../Types/Genre.ts"
import { Run } from '../Types/Run.ts';

type Props = {
  movieId: number;
};

const MoviePreview = ({ movieId }: Props) => {
  const { movieService, ageRestrictionService, publisherService, languageService, countryService, moviesGenreService, genreService, runService } = useServiceStore();
  const [movieData, setMovieData] = useState<MovieType | null>(null);
  const [loading, setLoading] = useState(true);

  // Store classifier information
  const [ageRestriction, setAgeRestriction] = useState("");
  const [publisher, setPublisher] = useState("");
  const [language, setLanguage] = useState("");
  const [country, setCountry] = useState("");
  const [genres, setGenres] = useState<Genre[]>([]);
  const [run, setRun] = useState<Run>();


  const navigate = useNavigate();

  const handleSelectMovie = () => {
    console.log('Navigating to ', movieId);
    navigate(`/movies/${movieId}`);
  }


  const [posterUrl, setPosterUrl] = useState<string | null>(null);


  const fetchPosterFromTMDb = async (movieName: string) => {
    const apiKey = '2e91b821519813db6f632ab7c32d176a';
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(movieName)}`);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const posterPath = data.results[0].poster_path;
      if (posterPath) {
        return `https://image.tmdb.org/t/p/w500${posterPath}`;
      }
    }

    return null;
  };




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
            const languageData = await languageService.getAll(
              `LanguageId = ${movie.languageId}`, "", 1, 1
            );
            if (languageData.length > 0) {
              setLanguage(languageData[0].language1 || languageData[0].language1 || String(movie.languageId));
            }
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
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        width: '100%',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        color: '#6c757d',
        fontSize: '16px',
        fontWeight: 500,
      }}>
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  if (!movieData) {
    return (
      <div style={{
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        color: '#dc3545',
        textAlign: 'center',
      }}>
        Movie not found
      </div>
    );
  }

  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden w-full max-w-md my-4 cursor-pointer transition-transform hover:scale-105"
      onClick={handleSelectMovie}>

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
      <div className="relative bg-white rounded-lg overflow-hidden">
        {posterUrl && (
          <img
            src={posterUrl}
            alt={`${movieData.name || 'Movie'} poster`}
            className="w-full h-64 object-cover rounded-t-lg shadow-xl"
          />
        )}

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-bold text-gray-800 leading-tight">
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
              <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                <strong>Publisher:</strong> {publisher}
              </span>
            )}
            {language && (
              <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                <strong>Language:</strong> {language}
              </span>
            )}
            {country && (
              <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                <strong>Country:</strong> {country}
              </span>
            )}
          </div>

          {movieData.description && (
            <div className="mb-3">
              <h3 className="text-base font-semibold text-gray-800 mb-1">
                Description
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {movieData.description}
              </p>
            </div>
          )}

          {genres && genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {genres.map((genre) => (
                <span
                  key={genre.genreId}
                  className="text-sm text-gray-700 bg-gray-200 px-2 py-1 rounded"
                >
                  {genre.genre1}
                </span>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 text-sm text-gray-800 bg-gray-50 p-3 rounded-lg">
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
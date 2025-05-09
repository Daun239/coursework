import React, { useEffect, useState } from 'react';
import { useServiceStore } from '@/Stores/ServicesStore';
import { Screening } from '@/Types/Screening';
import { Hall } from '@/Types/Hall';
import { Language } from '@/Types/Language';
import { ScreeningFormat } from '@/Types/ScreeningFormat';
import { useUserStore } from '@/Stores/UserStore';
import formFilterQuery from '@/lib/formFilterQuery';
import { Run } from '@/Types/Run';
import { Movie } from '@/Types/Movie';

const CreateOrUpdateScreening = ({ screeningId }: { screeningId?: number }) => {
    const {
        screeningService,
        screeningPriceService,
        screeningFormatService,
        hallService,
        languageService,
        movieService,
        runService
    } = useServiceStore();

    const [formData, setFormData] = useState({
        screeningId: 0,
        hallId: null,
        screeningFormatId: null,
        languageId: null,
        screeningTime: null,
        movieId: null,
        runId: null,
    });

    const [halls, setHalls] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [formats, setFormats] = useState([]);
    const [movieSearchQuery, setMovieSearchQuery] = useState('');
    const [movieSearchResults, setMovieSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [runs, setRuns] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const [run, setRun] = useState<Run>();

    const [movie, setMovie] = useState<Movie>();


    const { user } = useUserStore();

    const formatForDatetimeLocal = (date: Date) => {
        const pad = (n: number) => n.toString().padStart(2, '0');

        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };




    useEffect(() => {
        const fetchData = async () => {
            try {
                const [fetchedHalls, fetchedLanguages, fetchedFormats] = await Promise.all([
                    hallService.getAll(`cinemaId = ${user?.cinemaId}`, '', 1, 100),
                    languageService.getAll('', '', 1, 100),
                    screeningFormatService.getAll('', '', 1, 100),
                ]);

                setHalls(fetchedHalls.items ?? fetchedHalls);
                setLanguages(fetchedLanguages.items ?? fetchedLanguages);
                setFormats(fetchedFormats.items ?? fetchedFormats);

                if (screeningId) {
                    const [existingScreening] = await screeningService.getAll(`screeningId = ${screeningId}`);
                    if (existingScreening) {
                        setFormData(existingScreening);

                        if (existingScreening.startDate && existingScreening.startTime) {
                            const combinedDateTime = new Date(`${existingScreening.startDate}T${existingScreening.startTime}`);
                            const formatted = formatForDatetimeLocal(combinedDateTime);

                            setFormData(prev => ({
                                ...prev,
                                screeningTime: formatted,
                            }));
                        }


                        const [run] = await runService.getAll(`runId = ${existingScreening.runId}`);
                        setRun(run);

                        const [movie] = await movieService.getAll(`movieId = ${run.movieId}`);
                        setMovie(movie);

                        setMovieSearchQuery(movie.name);

                    }
                }
            } catch (error) {
                console.error("Error fetching screening data:", error);
            }
        };

        fetchData();
    }, [screeningId, hallService, languageService, screeningFormatService, screeningService, runService, movieService, user?.cinemaId]);



    // Handle movie search
    useEffect(() => {
        const searchMovies = async () => {
            if (movieSearchQuery.trim().length < 2) {
                setMovieSearchResults([]);
                return;
            }

            setIsSearching(true);
            try {
                const query = formFilterQuery("AND",
                    {
                        field: "name",
                        operator: "contains",
                        values: [movieSearchQuery],
                    }
                )
                // const query = `name CONTAINS '${movieSearchQuery}'`;
                const results = await movieService.getAll(query, '', 1, 10);
                setMovieSearchResults(results.items ?? results);
            } catch (error) {
                console.error("Error searching movies:", error);
            } finally {
                setIsSearching(false);
            }
        };

        const debounceTimeout = setTimeout(searchMovies, 500);
        return () => clearTimeout(debounceTimeout);
    }, [movieSearchQuery, movieService]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Clear any error for this field
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null,
            });
        }
    };

    const handleMovieSelect = async (movie1) => {
        try {
            // Set the selected movie ID and reset the search


            const [movie2] = await movieService.getAll(`movieId = ${movie1.movieId}`)

            setMovie(movie2);

            const [run] = await runService.getAll(`movieId = ${movie1.movieId}`);

            setRun(run);


            setFormData({
                ...formData,
                movieId: movie1.movieId,
                runId: run.runId // Reset run ID when changing movies
            });



            console.log('movie set', movie);

            setMovieSearchQuery(movie.name);
            setMovieSearchResults([]);

            // Fetch runs for the selected movie
            const fetchedRuns = await runService.getAll(`movieId = ${movie.movieId}`, '', 1, 100);
            setRuns(fetchedRuns.items ?? fetchedRuns);
        } catch (error) {
            console.error("Error fetching runs for selected movie:", error);
        }
    };

    const validateForm = () => {
        const newErrors: any = {};

        if (!formData.hallId) newErrors.hallId = "Hall is required";
        if (!formData.screeningFormatId) newErrors.screeningFormatId = "Screening format is required";
        if (!formData.languageId) newErrors.languageId = "Language is required";
        if (!formData.movieId) newErrors.movieId = "Movie is required";

        if (!formData.screeningTime) {
            newErrors.screeningTime = "Screening time is required";
        } else {
            const screeningTime = new Date(formData.screeningTime);

            if (screeningTime <= new Date()) {
                newErrors.screeningTime = "Screening has to occur in the future";
            }

            if (run) {
                const start = new Date(run.startDate);
                const end = new Date(run.endDate);

                if (screeningTime < start || screeningTime > end) {
                    newErrors.screeningTime = "Screening has to occur between run start and end date";
                }
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        setSuccessMessage('');

        try {
            if (!formData.screeningTime || !movie?.runtime) {
                setErrors({ screeningTime: "Invalid screening time or missing movie runtime" });
                return;
            }

            const screeningDate = new Date(formData.screeningTime);
            const endDate = new Date(screeningDate.getTime() + movie.runtime * 60000); // Add runtime in minutes

            const startDate = screeningDate.toISOString().split("T")[0]; // 'YYYY-MM-DD'
            const startTime = screeningDate.toTimeString().slice(0, 5);  // 'HH:mm'
            const endTime = endDate.toTimeString().slice(0, 5);          // 'HH:mm'

            const payload = {
                ...formData,
                startDate,
                startTime,
                endTime,
            };

            if (screeningId) {
                await screeningService.update(payload);
                setSuccessMessage("Screening updated successfully");
            } else {

                console.log('payload', payload);
                await screeningService.create(payload);
                setSuccessMessage("Screening created successfully");

                // Reset form after successful creation
                setFormData({
                    screeningId: 0,
                    hallId: null,
                    screeningFormatId: null,
                    languageId: null,
                    screeningTime: null,
                    movieId: null,
                    runId: null,
                });
                setMovieSearchQuery('');
            }
        } catch (error) {
            console.error("Error saving screening:", error);
            setErrors({
                submit: "Failed to save screening. Please try again."
            });
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 transition-colors duration-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                {screeningId ? 'Update Screening' : 'Create New Screening'}
            </h2>

            {successMessage && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md border-l-4 border-green-500 flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {successMessage}
                </div>
            )}

            {errors.submit && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md border-l-4 border-red-500 flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {errors.submit}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Movie Search Field */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Movie
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={movieSearchQuery}
                            onChange={(e) => setMovieSearchQuery(e.target.value)}
                            placeholder="Search for a movie..."
                            className={`w-full p-3 bg-white dark:bg-gray-700 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 dark:text-gray-100 ${errors.movieId
                                ? 'border-red-500 dark:border-red-500'
                                : 'border-gray-300 dark:border-gray-600'
                                }`}
                        />
                        {isSearching && (
                            <div className="absolute right-3 top-3">
                                <svg className="animate-spin h-5 w-5 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                        )}

                        {movieSearchResults.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
                                {movieSearchResults.map((movie) => (
                                    <div
                                        key={movie.id}
                                        className="p-3 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-gray-800 dark:text-gray-200 transition-colors duration-150"
                                        onClick={() => handleMovieSelect(movie)}
                                    >
                                        {movie.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {errors.movieId && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.movieId}</p>
                    )}
                </div>

                {/* Run Selection */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Run
                    </label>

                    <span className="block text-sm text-gray-600 dark:text-gray-400">
                        <strong>Run start date:</strong> {run?.startDate ?? 'N/A'}
                    </span>
                    <span className="block text-sm text-gray-600 dark:text-gray-400">
                        <strong>Run end date:</strong> {run?.endDate ?? 'N/A'}
                    </span>
                </div>


                {/* Hall Selection */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Hall
                    </label>
                    <select
                        disabled={!!screeningId}
                        name="hallId"
                        value={formData.hallId || ''}
                        onChange={handleInputChange}
                        className={`w-full p-3 bg-white dark:bg-gray-700 border rounded-md shadow-sm
              focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
              focus:border-blue-500 dark:focus:border-blue-400 dark:text-gray-100
              ${errors.hallId ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'}
              disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500`}
                    >

                    </select>
                    {errors.hallId && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.hallId}</p>
                    )}
                </div>

                {/* Screening Format */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Format
                    </label>
                    <select
                        name="screeningFormatId"
                        value={formData.screeningFormatId || ''}
                        onChange={handleInputChange}
                        className={`w-full p-3 bg-white dark:bg-gray-700 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 dark:text-gray-100 ${errors.screeningFormatId
                            ? 'border-red-500 dark:border-red-500'
                            : 'border-gray-300 dark:border-gray-600'
                            }`}
                    >
                        <option value="">Select a format</option>
                        {formats.map((format) => (
                            <option key={format.screeningFormatId} value={format.screeningFormatId}>
                                {format.screeningFormat1}
                            </option>
                        ))}
                    </select>
                    {errors.screeningFormatId && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.screeningFormatId}</p>
                    )}
                </div>

                {/* Language */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Language
                    </label>
                    <select
                        name="languageId"
                        value={formData.languageId || ''}
                        onChange={handleInputChange}
                        className={`w-full p-3 bg-white dark:bg-gray-700 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 dark:text-gray-100 ${errors.languageId
                            ? 'border-red-500 dark:border-red-500'
                            : 'border-gray-300 dark:border-gray-600'
                            }`}
                    >
                        <option value="">Select a language</option>
                        {languages.map((language) => (
                            <option key={language.languageId} value={language.languageId}>
                                {language.language1}
                            </option>
                        ))}
                    </select>
                    {errors.languageId && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.languageId}</p>
                    )}
                </div>

                {/* Screening Time */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Screening Time
                    </label>
                    <input
                        type="datetime-local"
                        name="screeningTime"
                        value={formData.screeningTime || ''}
                        onChange={handleInputChange}
                        className={`w-full p-3 bg-white dark:bg-gray-700 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 dark:text-gray-100 ${errors.screeningTime
                            ? 'border-red-500 dark:border-red-500'
                            : 'border-gray-300 dark:border-gray-600'
                            }`}
                    />
                    {errors.screeningTime && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.screeningTime}</p>
                    )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow transition-colors duration-200 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </span>
                        ) : screeningId ? 'Update Screening' : 'Create Screening'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateOrUpdateScreening;
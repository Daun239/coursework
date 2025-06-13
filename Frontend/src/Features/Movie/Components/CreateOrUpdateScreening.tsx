import React, { useEffect, useState } from 'react';
import { useServiceStore } from '@/Stores/ServicesStore';
import { useUserStore } from '@/Stores/UserStore';
import formFilterQuery from '@/lib/formFilterQuery';
import { t } from 'i18next';
import { ScreeningPrice } from '@/Types/ScreeningPrice';

type Props = {
    handleRerender: () => void;
    screeningId: number;
}

const CreateOrUpdateScreening = ({ screeningId, handleRerender }: Props) => {
    const {
        screeningService,
        screeningFormatService,
        hallService,
        languageService,
        movieService,
        runService,
        seatService,
        seatCategoryService,
        screeningPriceService
    } = useServiceStore();


    const [doesHallHaveVipSeats, setDoesHallHaveVipSeats] = useState<boolean>(false);

    const [formData, setFormData] = useState({
        screeningId: 0,
        hallId: null,
        screeningFormatId: null,
        languageId: null,
        screeningTime: null,
        movieId: null,
        runId: null,
        screeningPrice: 1,
        vipScreeningPrice: 1,
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

    const [run, setRun] = useState(null);
    const [movie, setMovie] = useState(null);

    const { user } = useUserStore();

    const [selectedHall, setSelectedHall] = useState<boolean>(false);

    const formatForDatetimeLocal = (date) => {
        if (!date) return '';

        const pad = (n) => n.toString().padStart(2, '0');
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
    
                if (screeningId && screeningId !== 0) {
                    const [existingScreening] = await screeningService.getAll(`screeningId = ${screeningId}`);
                    if (!existingScreening) return;
    
                    const [fetchedHall] = await hallService.getAll(`hallId = ${existingScreening.hallId}`);
                    const [fetchedLanguage] = await languageService.getAll(`languageId = ${existingScreening.languageId}`);
                    const [fetchedScreeningFormat] = await screeningFormatService.getAll(`screeningFormatId = ${existingScreening.screeningFormatId}`);
                    const screeningPrices = await screeningPriceService.getAll(`screeningId = ${screeningId}`);
    
                    let run = null;
                    let movie = null;
                    if (existingScreening.runId) {
                        [run] = await runService.getAll(`runId = ${existingScreening.runId}`);
                        setRun(run);
    
                        if (run?.movieId) {
                            [movie] = await movieService.getAll(`movieId = ${run.movieId}`);
                            setMovie(movie);
                            setMovieSearchQuery(movie?.name || '');
                        }
                    }
    
                    const combinedDateTime = existingScreening.startDate && existingScreening.startTime
                        ? formatForDatetimeLocal(new Date(`${existingScreening.startDate}T${existingScreening.startTime}`))
                        : '';
    
                    setFormData({
                        ...existingScreening,
                        hallId: fetchedHall?.hallId ?? existingScreening.hallId,
                        languageId: fetchedLanguage?.languageId ?? existingScreening.languageId,
                        screeningFormatId: fetchedScreeningFormat?.screeningFormatId ?? existingScreening.screeningFormatId,
                        screeningTime: combinedDateTime,
                        screeningPrice: screeningPrices[0]?.ticketPrice ?? '',
                        vipScreeningPrice: screeningPrices[1]?.ticketPrice ?? '',
                    });
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
                );
                let results = await movieService.getAll(query, '', 1, 10);

                const today = new Date().toISOString().split("T")[0]; // "2025-05-15"

                let runFilterQuery = formFilterQuery("AND", {
                    field: "movieId",
                    operator: 'in',
                    values: results.map(m => m.movieId)
                });

                runFilterQuery += ` AND StartDate <= "${today}" AND EndDate >= "${today}"`;


                const runs = await runService.getAll(runFilterQuery);

                // Filter results to only include those with a valid run
                results = results.filter(r => runs.find(run => run.movieId === r.movieId));

                // Set final search results
                setMovieSearchResults(results);

            } catch (error) {
                console.error("Error searching movies:", error);
            } finally {
                setIsSearching(false);
            }
        };

        const debounceTimeout = setTimeout(searchMovies, 500);
        return () => clearTimeout(debounceTimeout);
    }, [movieSearchQuery, movieService]);


    const selectHall = async () => {

        const seats = await seatService.getAll(`hallId = ${formData.hallId}`);

        const hasVip = seats.some(s => s.seatCategoryId === 1);

        setDoesHallHaveVipSeats(hasVip);

        setSelectedHall(true);
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));

        // If hallId is changed, call selectHall
        if (name === "hallId") {
            // Delay until state updates
            setTimeout(() => {
                selectHall();
            }, 0);
        }
    };


    // Clear any error for this field
    if (errors[name]) {
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: null,
        }));
    }

    const handleMovieSelect = async (selectedMovie) => {
        if (!selectedMovie || !selectedMovie.movieId) return;

        try {
            setIsSearching(true);

            // Set the selected movie
            setMovie(selectedMovie);
            setMovieSearchQuery(selectedMovie.name || '');
            setMovieSearchResults([]);

            // Fetch runs for the selected movie
            const fetchedRuns = await runService.getAll(`movieId = ${selectedMovie.movieId}`, '', 1, 100);
            const runsList = fetchedRuns.items ?? fetchedRuns;
            setRuns(runsList);

            // Select the first run if available
            if (runsList && runsList.length > 0) {
                const firstRun = runsList[0];
                setRun(firstRun);

                // Update form data with movie and run IDs
                setFormData(prevData => ({
                    ...prevData,
                    movieId: selectedMovie.movieId,
                    runId: firstRun.runId
                }));
            } else {
                // No runs available
                setRun(null);
                setFormData(prevData => ({
                    ...prevData,
                    movieId: selectedMovie.movieId,
                    runId: null
                }));

                setErrors(prevErrors => ({
                    ...prevErrors,
                    runId: t('screening.noRunsAvailableForMovie')
                }));
            }
        } catch (error) {
            console.error("Error fetching runs for selected movie:", error);
            setErrors(prevErrors => ({
                ...prevErrors,
                movieId: t('screening.errorFetchingRuns')
            }));
        } finally {
            setIsSearching(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.hallId) newErrors.hallId = t('screening.hallIsRequired');
        if (!formData.screeningFormatId) newErrors.screeningFormatId = t('screening.screeningFormatIsRequired');
        if (!formData.languageId) newErrors.languageId = t('screening.languageIsRequired');
        if (!formData.movieId) newErrors.movieId = t('screening.movieIsRequired');
        if (!formData.runId) newErrors.runId = t('screening.runIsRequired');

        if (!formData.screeningTime) {
            newErrors.screeningTime = t('screening.screeningTimeIsRequired');
        } else {
            const screeningTime = new Date(formData.screeningTime);

            if (screeningTime <= new Date()) {
                newErrors.screeningTime = t('screening.screeningHasToOccurInFuture');
            }

            if (run) {
                const start = new Date(run.startDate);
                const end = new Date(run.endDate);

                if (screeningTime < start || screeningTime > end) {
                    newErrors.screeningTime = t('screening.screeningHasToOccurBetweenRunStartAndEndDates');
                }

                if (start >= end) {
                    newErrors.runTime = t('screening.runStartDateHasToBeBeforeEndDate');
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
                setErrors({ screeningTime: t('screening.invalidScreeningTimeOrMissingMovieRuntime') });
                setIsSubmitting(false);
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

                const payload2 = {...payload,
                    screeningId: screeningId
                }
                await screeningService.update(payload2);

                const screeningPrices = await screeningPriceService.getAll(`screeningId = ${screeningId}`);

                const normalPrice: ScreeningPrice = { ...screeningPrices[0], ticketPrice: formData.screeningPrice };

                await screeningPriceService.update(normalPrice);

                if (doesHallHaveVipSeats) {
                    const vipPrice: ScreeningPrice = { ...screeningPrices[1], ticketPrice: formData.screeningPrice };

                    await screeningPriceService.update(vipPrice);
                }
                setSuccessMessage(t('screening.updatedSuccessfully'));
            } else {


                const result = await screeningService.create(payload);

                // Create normal price (assuming seatCategoryId 1 = Regular)
                const normalScreeningPrice: ScreeningPrice = {
                    seatCategoryId: 1,
                    ticketPrice: formData.screeningPrice,
                    screeningId: result.screeningId,
                    screeningPriceId: 0,
                };

                await screeningPriceService.create(normalScreeningPrice);

                // Create VIP price if VIP seats exist
                if (doesHallHaveVipSeats && formData.vipScreeningPrice != null) {
                    const vipScreeningPrice: ScreeningPrice = {
                        seatCategoryId: 2, // Assuming 2 = VIP
                        ticketPrice: formData.vipScreeningPrice,
                        screeningId: result.screeningId,
                        screeningPriceId: 0,
                    };

                    await screeningPriceService.create(vipScreeningPrice);
                }



                setSuccessMessage(t('screening.createdSuccessfully'));

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
                setMovie(null);
                setRun(null);
            }

            // Call the parent component's rerender function
            handleRerender();
        } catch (error) {
            console.error("Error saving screening:", error);
            setErrors({
                submit: t('screening.submitError')
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 transition-colors duration-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                {screeningId ? t('screening.update') : t('screening.create')}
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

            <div className='max-h-[80vh] overflow-y-auto pr-2'>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Movie Search Field */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('screening.movie')}
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={movieSearchQuery}
                                onChange={(e) => setMovieSearchQuery(e.target.value)}
                                placeholder={t('screening.searchForMovie')}
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
                                            key={movie.movieId}
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





                    {(selectedHall || screeningId)  && (
                        <div className="relative mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t('screening.normalPrice')}
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={formData.screeningPrice || ''}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        screeningPrice: Number(e.target.value)
                                    })
                                }
                                placeholder={t('screening.normalPrice')}
                                className={`w-full p-3 bg-white dark:bg-gray-700 border rounded-md shadow-sm
                focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                focus:border-blue-500 dark:focus:border-blue-400 dark:text-gray-100
                ${errors.screeningPrices ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                            />
                        </div>
                    )}

                    {(selectedHall || screeningId) && doesHallHaveVipSeats && (
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t('screening.vipPrice')}
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={formData.vipScreeningPrice || ''}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        vipScreeningPrice: Number(e.target.value)
                                    })
                                }
                                placeholder={t('screening.vipPrice')}
                                className={`w-full p-3 bg-white dark:bg-gray-700 border rounded-md shadow-sm
                focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                focus:border-blue-500 dark:focus:border-blue-400 dark:text-gray-100
                ${errors.screeningPrices ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                            />
                        </div>
                    )}



                    {/* Run Selection */}
                    {movie && (
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('screening.run')}
                            </label>

                            {run ? (
                                <>
                                    <span className="block text-sm text-gray-600 dark:text-gray-400">
                                        <strong>{t('screening.runStartDate')}</strong> {run.startDate ?? 'N/A'}
                                    </span>
                                    <span className="block text-sm text-gray-600 dark:text-gray-400">
                                        <strong>{t('screening.runEndDate')}</strong> {run.endDate ?? 'N/A'}
                                    </span>
                                </>
                            ) : (
                                <span className="block text-sm text-red-600 dark:text-red-400">
                                    {t('screening.noRunSelected')}
                                </span>
                            )}

                            {errors.runId && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.runId}</p>
                            )}
                        </div>
                    )}

                    {/* Hall Selection */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('screening.hall')}
                        </label>
                        <select
                            // disabled={!!screeningId}
                            name="hallId"
                            value={formData.hallId || ''}
                            onChange={handleInputChange}
                            className={`w-full p-3 bg-white dark:bg-gray-700 border rounded-md shadow-sm
                                focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                                focus:border-blue-500 dark:focus:border-blue-400 dark:text-gray-100
                                ${errors.hallId ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'}
                                disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500`}
                        >
                            <option value="">{t('screening.hall')}</option>
                            {halls.map((hall) => (
                                <option key={hall.hallId} value={hall.hallId}>
                                    {hall.hallNumber}
                                </option>
                            ))}
                        </select>
                        {errors.hallId && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.hallId}</p>
                        )}
                    </div>

                    {/* Screening Format */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('screening.format')}
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
                            <option value="">{t('screening.selectFormat')}</option>
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
                            {t('screening.language')}
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
                            <option value="">{t('screening.selectLanguage')}</option>
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
                            {t('screening.time')}
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
                                    {t('screening.processing')}
                                </span>
                            ) : screeningId ? t('save') : t('create')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateOrUpdateScreening;
import DropdownList from "@/components/DropdownList";
import Pagination from "@/components/Pagination";
import RangeSlider from "@/components/RangeSlider";
import ScreeningTimeComponent from "@/components/ScreeningTimeComponent";
import ScreeningTickets from "@/Features/Screenings/Components/ScreeningTickets";
import formFilterQuery from "@/lib/formFilterQuery";
import { useServiceStore } from "@/Stores/ServicesStore";
import { AgeRestriction } from "@/Types/AgeRestriction";
import { Country } from "@/Types/Country";
import { Genre } from "@/Types/Genre";
import { Language } from "@/Types/Language";
import { Movie } from "@/Types/Movie";
import { Publisher } from "@/Types/Publisher";
import { Run } from "@/Types/Run";
import { Screening } from "@/Types/Screening";
import { useState, useEffect, useCallback } from "react";
import { useMovieFiltersLoader } from "../Hooks/useMovieFiltersLoader";
import MoviePreview from "./MoviePreview";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { useTranslation } from "../Hooks/useTranslation";
import CreateOrUpdateMovie from "./CreateOrUpdateMovie";
import CreateOrUpdateScreening from "./CreateOrUpdateScreening";
import { useUserStore } from "@/Stores/UserStore";
import { exportMovieData } from "../Utils/exportMovieData";


function handleSelectionChange<T>(selected: T[], setState: React.Dispatch<React.SetStateAction<T[]>>) {
    setState(selected);
}

const MovieList = () => {
    const { t } = useTranslation();
    const { hallService, runService, screeningService, movieService, genreService, moviesGenreService, languageService, countryService, publisherService, ageRestrictionService } = useServiceStore();
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    const [genres, setGenres] = useState<Genre[]>([]);
    const [ageRestrictions, setAgeRestrictions] = useState<AgeRestriction[]>([])
    const [languages, setLanguages] = useState<Language[]>([]);
    const [publishers, setPublishers] = useState<Publisher[]>([]);
    const [countries, setCountries] = useState<Country[]>([]);

    const [title, setTitle] = useState<string>("");

    const [pageSize, setPageSize] = useState<number>(50);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pagesCount, setPagesCount] = useState<number>(10);

    const [runs, setRuns] = useState<Run[]>([]);
    const [screenings, setScreenings] = useState<Screening[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [rerenderKey, setRerenderKey] = useState<number>(0); // New state for forcing re-renders

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    // Improved rerender function using a numeric key instead of a boolean toggle
    const handleRerender = useCallback(() => {
        setRerenderKey(prevKey => prevKey + 1);
        setLoading(true); // Set loading state to show loading indicator
    }, []);

    const { user } = useUserStore();

    const handleAddMovie = () => {
        if (createMovieOpen === true)
            setSelectedMovieId(null);

        setCreateMovieOpen(prev => !prev);
    }

    const handleAddScreening = () => {
        if (createMovieOpen === true)
            setSelectedScreeningId(null);

        setCreateScreeningOpen(prev => !prev);
    }

    const [createScreeningOpen, setCreateScreeningOpen] = useState(false);
    const [selectedScreeningId, setSelectedScreeningId] = useState<number>(null)

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if ((e.key === "f" || e.key === 'а') && (e.metaKey || e.ctrlKey) && e.altKey) {
                e.preventDefault()
                toggleSidebar();
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            // Perform the search action here
            const searchTerm = e.currentTarget.value; // Fixed: using currentTarget instead of target
            console.log('Search for:', searchTerm);
            setTitle(searchTerm);
        }
    };

    const {
        minBudget, maxBudget, selectedBudgetRange, setSelectedBudgetRange,
        minRuntime, maxRuntime, selectedRuntimeRange, setSelectedRuntimeRange,
        moviesCount
    } = useMovieFiltersLoader();

    const getScreeningsForMovie = useCallback((movieId: number): Screening[] => {
        const movieRunIds = runs.filter(run => run.movieId === movieId).map(run => run.runId);
        return screenings.filter(screening => movieRunIds.includes(screening.runId));
    }, [runs, screenings]);

    const [selectedScreening, setSelectedScreening] = useState<Screening | null>(null);

    useEffect(() => {
        setPagesCount(Math.ceil(moviesCount / pageSize));
        console.log("pagescount", pagesCount);
    }, [pageSize, moviesCount, pagesCount]);

    const [createMovieOpen, setCreateMovieOpen] = useState<boolean>(false);
    const [selectedMovieId, setSelectedMovieId] = useState<number>(undefined);

    const handleSelectMovie = useCallback((movieId: number) => {
        setSelectedMovieId(movieId);
        setCreateMovieOpen(true);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // scrolls to top
    }, []);

    const handleSelectScreening = useCallback((screeningId: number) => {
        setSelectedScreeningId(screeningId);
        setCreateScreeningOpen(true);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // scrolls to top
    }, []);

    const [showMoviesNoScreenings, setShowMoviesNoScreenings] = useState<boolean>(true);

    // Optimized fetchMovies function extracted for clarity
    const fetchMovies = useCallback(async () => {
        console.log('fetching movies');
        setLoading(true);

        try {
            const movieGenreQuery = formFilterQuery(
                "AND", {
                field: "genreId",
                values: genres.map(g => g.genreId).filter(id => id != null),
                operator: 'in',
            });

            const correspondingMoviesByGenre = await moviesGenreService.getAll(movieGenreQuery, "", currentPage, 100000);

            const uniqueMovies = correspondingMoviesByGenre.filter((movie, index, self) =>
                index === self.findIndex((m) => m.movieId === movie.movieId)
            );

            const movieIds = uniqueMovies.map(m => m.movieId);

            let filterQuery = formFilterQuery(
                "AND",
                {
                    field: 'movieId',
                    values: movieIds,
                    operator: 'in'
                },
                {
                    field: 'budget',
                    values: selectedBudgetRange.map(v => v.toString()).filter(v => v !== '0'),
                    operator: 'range'
                },
                {
                    field: 'runtime',
                    values: selectedRuntimeRange.map(v => v.toString()).filter(v => v !== '0'),
                    operator: 'range'
                },
                {
                    field: 'languageId',
                    values: languages.map((l => l.languageId)),
                    operator: 'in',
                },
                {
                    field: 'ageRestrictionId',
                    operator: 'in',
                    values: ageRestrictions.map(a => a.ageRestrictionId),
                },
                {
                    field: 'countryId',
                    operator: 'in',
                    values: countries.map(c => c.countryId),
                },
                {
                    field: 'publisherId',
                    operator: 'in',
                    values: publishers.map(p => p.publisherId)
                }
            );

            if (title) {
                filterQuery = filterQuery + ` AND ` + formFilterQuery("OR",
                    {
                        field: 'name',
                        values: title ? [title] : [],
                        operator: "contains"
                    },
                    {
                        field: 'description',
                        values: title ? [title] : [],
                        operator: "contains"
                    }
                );
            }

            if (filterQuery) {
                console.log('Filter Query:', filterQuery);
                const data = await movieService.getAll(filterQuery, "", currentPage, pageSize);
                console.log("data", data);

                // Important: Make sure state updates properly with new references
                setMovies([...data]);

                console.log("Rendering with movies:", data.length, "movies");

                // Fetch runs AFTER movies are fetched, using the fetched movie IDs directly
                const moviesFromResponse = data; // Use the data response directly
                const movieIdsFromResponse = moviesFromResponse.map(m => m.movieId);

                const runsQuery = formFilterQuery("AND", {
                    field: "movieId",
                    operator: "in",
                    values: movieIdsFromResponse
                });

                const fetchedRuns = await runService.getAll(runsQuery, "", 1, 100000);
                setRuns([...fetchedRuns]); // Ensure new array reference

                // Use the correct field (runId) from the fetched runs for the screenings query
                if (fetchedRuns.length > 0) {
                    const runIds = fetchedRuns.map(r => r.runId);

                    const halls = await hallService.getAll(`cinemaId = ${user?.cinemaId}`, "", 1, 10000);

                    let screeningsQuery = formFilterQuery("AND", {
                        field: 'runId',
                        operator: "in",
                        values: runIds, // Fixed: using runId instead of movieId
                    },
                        {
                            field: "hallId",
                            operator: "in",
                            values: halls.map(h => h.hallId)
                        });

                    const fetchedScreenings = await screeningService.getAll(screeningsQuery, "startDate desc", 1, 1000);
                    console.log('Fetched screenings:', fetchedScreenings.length, "screenings");
                    setScreenings([...fetchedScreenings]); // Ensure new array reference
                } else {
                    // If no runs found, set empty screenings array
                    setScreenings([]);
                }
            }
        } catch (error) {
            console.error('Failed to fetch movies:', error);
        } finally {
            setLoading(false);
        }
    }, [
        currentPage,
        movieService,
        genres,
        ageRestrictions,
        languages,
        publishers,
        countries,
        selectedBudgetRange,
        selectedRuntimeRange,
        title,
        pageSize,
        user,
        hallService,
        moviesGenreService,
        runService,
        screeningService
    ]);

    // Updated useEffect with rerenderKey dependency
    useEffect(() => {
        fetchMovies();
        // Added rerenderKey to dependencies to ensure re-execution when handleRerender is called
    }, [rerenderKey, fetchMovies]);

    // Render loading indicator when loading
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-xl"></span>
            </div>
        );
    }

    const handleExport = (format: "csv" | "json" | "pdf") => {
        const services = {
            languageService,
            publisherService,
            ageRestrictionService,
            countryService,
        };

        exportMovieData(movies, format, `movies_data_${format}`, services);
    };

    return (
        <div className="flex h-screen overflow-hidden mt-16">
            {/* Sidebar with filters */}
            <div
                className={`
                    transition-all duration-300 ease-in-out h-screen overflow-auto
                    ${isSidebarOpen ? 'w-80' : 'w-0'}
                `}
            >
                <div className="w-80 h-full bg-white dark:bg-gray-900 p-4 shadow-lg">

                    <div className="filters-container">
                        {movies.length > 0 && <h2 className="font-semibold text-xl mb-4">{movies.length} {t('movieList.moviesFound')}</h2>}

                        <DropdownList
                            listName={t('movieList.filterByAgeRestrictions')}
                            service={ageRestrictionService}
                            displayKey="ageRestriction1"
                            onSelectionChange={(selected: any[]) => handleSelectionChange(selected, setAgeRestrictions)}
                        />

                        <DropdownList
                            listName={t('movieList.filterByGenres')}
                            service={genreService}
                            displayKey="genre1"
                            onSelectionChange={(selected: any[]) => handleSelectionChange(selected, setGenres)}
                        />

                        <DropdownList
                            listName={t('movieList.filterByCountries')}
                            service={countryService}
                            displayKey="country1"
                            onSelectionChange={(selected: any[]) => handleSelectionChange(selected, setCountries)}
                        />

                        <DropdownList
                            listName={t('movieList.filterByPublishers')}
                            service={publisherService}
                            displayKey="publisher1"
                            onSelectionChange={(selected: any[]) => handleSelectionChange(selected, setPublishers)}
                        />

                        <DropdownList
                            listName={t('movieList.filterByLanguage')}
                            service={languageService}
                            displayKey="language1"
                            onSelectionChange={(selected: any[]) => handleSelectionChange(selected, setLanguages)}
                        />

                        <label className="input bg-gray-200 dark:bg-gray-800 my-4">
                            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                    strokeWidth="2.5"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <path d="m21 21-4.3-4.3"></path>
                                </g>
                            </svg>
                            <input
                                type="search"
                                required
                                placeholder={t('movieList.searchPlaceholder')}
                                onKeyDown={handleSearch}
                                className="pl-6"
                            />
                        </label>

                        {/* Range Sliders */}
                        <RangeSlider
                            min={minBudget}
                            max={maxBudget}
                            onRangeCommit={(range) => setSelectedBudgetRange(range)}
                            sliderName={t('movieList.budget')}
                            currency="$"
                        />

                        <RangeSlider
                            min={minRuntime}
                            max={maxRuntime}
                            onRangeCommit={(range) => setSelectedRuntimeRange(range)}
                            sliderName={t('movieList.runtime')}
                            currency={t('movieList.minutes')}
                        />

                        <label className="flex items-center gap-2 mt-4">
                            <input
                                checked={showMoviesNoScreenings}
                                type="checkbox"
                                onChange={() => setShowMoviesNoScreenings(prev => !prev)}
                            />
                            {t('movieList.showNoScreeningsMovies')}
                        </label>

                    </div>

                    <div className="mt-2">
                        <label className="block font-medium mb-4">{t('movieList.itemsPerPage')}</label>
                        <select
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setCurrentPage(1); // Reset to first page when size changes
                            }}
                            className="bg-gray-200 dark:bg-gray-800 select select-bordered w-full"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                            <option value={250}>250</option>

                        </select>
                    </div>

                    {/* Pagination component inside sidebar */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={pagesCount}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col h-screen overflow-auto">
                {/* Toggle sidebar button */}
                <div className="p-4 flex justify-between items-center">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-md dark:bg-gray-900 bg-gray-400 text-white hover:bg-primary-dark transition-colors"
                    >
                        {isSidebarOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>

                </div>

                <div className="flex-1 flex flex-col h-screen overflow-auto bg-gray-50 dark:bg-gray-800">
                    {/* Header section with action buttons */}
                    <div className="p-6 flex justify-between items-center bg-gray-200 dark:bg-gray-700 rounded-lg shadow-md mb-6">

                        {/* Left side - Add Movie and Add Screening buttons */}
                        <div className="flex space-x-4">
                            <button
                                onClick={handleAddMovie}
                                className="px-4 py-2 rounded-md dark:bg-gray-900 bg-gray-400 text-white hover:bg-primary-dark focus:outline-none transition-colors duration-300 ease-in-out"
                            >
                                {t('movieList.addMovie')}
                            </button>

                            <button
                                onClick={handleAddScreening}
                                className="px-4 py-2 rounded-md dark:bg-gray-900 bg-gray-400 text-white hover:bg-primary-dark focus:outline-none transition-colors duration-300 ease-in-out"
                            >
                                {t('movieList.addScreening')}
                            </button>
                        </div>

                        {/* Right side - Export buttons */}
                        <div className="flex space-x-4">
                            <button
                                onClick={() => handleExport("csv")}
                                title="Export as CSV"
                                className="flex items-center px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-300 focus:outline-none transition-all duration-300 ease-in-out shadow-md"
                            >
                                <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                                    <path d="M14 3v4a1 1 0 001 1h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <path d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <path d="M9 12h6M9 16h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                CSV
                            </button>

                            <button
                                onClick={() => handleExport("json")}
                                title="Export as JSON"
                                className="flex items-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all duration-300 ease-in-out shadow-md"
                            >
                                <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                                    <path d="M8 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-14a2 2 0 00-2-2h-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <path d="M8 7.5V4.5a2 2 0 114 0v3M8 7.5h4M16 15l-2-2m0 0l-2 2m2-2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                JSON
                            </button>
                        </div>
                    </div>

                    {/* Movie Modal */}
                    {createMovieOpen && (
                        <div className="fixed inset-0 z-50 flex items-center bg-black/50 justify-center">
                            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-2xl relative">
                                <button
                                    onClick={() => {
                                        setCreateMovieOpen(false);
                                        setSelectedMovieId(null);
                                    }}
                                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-white"
                                >
                                    ✕
                                </button>

                                <CreateOrUpdateMovie
                                    handleRerender={handleRerender}
                                    movieId={selectedMovieId}
                                />
                            </div>
                        </div>
                    )}

                    {/* Screening Modal */}
                    {createScreeningOpen && (
                        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
                            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-2xl relative">
                                <button
                                    onClick={() => {
                                        setCreateScreeningOpen(false);
                                        setSelectedScreeningId(null);
                                    }}
                                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-white"
                                >
                                    ✕
                                </button>

                                <CreateOrUpdateScreening
                                    screeningId={selectedScreeningId}
                                    handleRerender={handleRerender} // Added handleRerender prop here
                                />
                            </div>
                        </div>
                    )}

                    <div className="p-6 flex-1">
                        {/* Key-based container to force rerender */}
                        <div key={rerenderKey} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
                            {movies
                                .filter((movie) => {
                                    const movieScreenings = getScreeningsForMovie(movie.movieId);
                                    // Show all movies if checkbox is checked; otherwise, only movies that have screenings
                                    return showMoviesNoScreenings || (movieScreenings && movieScreenings.length > 0);
                                })
                                .map((movie) => {
                                    const movieScreenings = getScreeningsForMovie(movie.movieId);

                                    return (
                                        <div key={movie.movieId} className="rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg">
                                            <MoviePreview
                                                handleRerender={handleRerender}
                                                onSelectMovieId={handleSelectMovie}
                                                movieId={movie.movieId}
                                            />

                                            {movieScreenings && movieScreenings.length > 0 ? (
                                                <div className="p-4">
                                                    <Accordion type="single" collapsible>
                                                        <AccordionItem value="item-1">
                                                            <AccordionTrigger className="flex items-center gap-2 py-2 cursor-pointer">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                                <div className="flex">
                                                                    <h3 className="text-sm font-medium">
                                                                        {t('movieList.availableScreenings')} ({movieScreenings.length})
                                                                    </h3>
                                                                </div>
                                                            </AccordionTrigger>
                                                            <AccordionContent className="grid grid-cols-1 gap-3">
                                                                {movieScreenings.map((screening) => (
                                                                    <ScreeningTimeComponent
                                                                        handleRerender={handleRerender}
                                                                        key={screening.screeningId}
                                                                        screening={screening}
                                                                        onSelect={setSelectedScreening}
                                                                        onSelectScreeningId={handleSelectScreening}
                                                                    />
                                                                ))}
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                </div>
                                            ) : (
                                                <div className="p-4 text-center text-gray-500 italic">
                                                    {t('movieList.noScreenings')}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </div>

                {selectedScreening && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="rounded-xl shadow-xl max-w-5xl w-full relative bg-white">
                            <button
                                className="cursor-pointer absolute p-3 top-3 right-3 text-gray-500 hover:text-black text-4xl"
                                onClick={() => setSelectedScreening(null)}
                            >
                                ×
                            </button>
                            <ScreeningTickets id={selectedScreening.screeningId} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MovieList;
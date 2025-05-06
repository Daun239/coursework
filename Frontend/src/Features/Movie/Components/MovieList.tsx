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
import { useState, useEffect } from "react";
import { useMovieFiltersLoader } from "../Hooks/useMovieFiltersLoader";
import MoviePreview from "./MoviePreview";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { useTranslation } from "../Hooks/useTranslation";


function handleSelectionChange<T>(selected: T[], setState: React.Dispatch<React.SetStateAction<T[]>>) {
    setState(selected);
}

const MovieList = () => {
    const { t } = useTranslation();
    const { runService, screeningService, movieService, genreService, moviesGenreService, languageService, countryService, publisherService, ageRestrictionService } = useServiceStore();
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    const [genres, setGenres] = useState<Genre[]>([]);
    const [ageRestrictions, setAgeRestrictions] = useState<AgeRestriction[]>([])
    const [languages, setLanguages] = useState<Language[]>([]);
    const [publishers, setPublishers] = useState<Publisher[]>([]);
    const [countries, setCountries] = useState<Country[]>([]);

    const [title, setTitle] = useState<string>("");

    const [pageSize, setPageSize] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pagesCount, setPagesCount] = useState<number>(10);

    const [runs, setRuns] = useState<Run[]>([]);


    const [screenings, setScreenings] = useState<Screening[]>([]);

    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };


    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "f" && (e.metaKey || e.ctrlKey) && e.altKey) {
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
            const searchTerm = e.target.value;
            console.log('Search for:', searchTerm); // Replace with actual search logic]
            setTitle(searchTerm);
        }
    };




    const {
        minBudget, maxBudget, selectedBudgetRange, setSelectedBudgetRange,
        minRuntime, maxRuntime, selectedRuntimeRange, setSelectedRuntimeRange,
        moviesCount
    } = useMovieFiltersLoader();






    const getScreeningsForMovie = (movieId: number): Screening[] => {
        const movieRunIds = runs.filter(run => run.movieId === movieId).map(run => run.runId);
        return screenings.filter(screening => movieRunIds.includes(screening.runId));
    };


    const [selectedScreening, setSelectedScreening] = useState<Screening | null>(null);





    useEffect(() => {
        setPagesCount(Math.ceil(moviesCount / pageSize));

        console.log("pagescount", pagesCount)
    }, [pageSize, movies]);





    // Fixed useEffect to properly fetch screenings when currentPage changes
    useEffect(() => {
        const fetchMovies = async () => {
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
                    setMovies(data);

                    // Fetch runs AFTER movies are fetched, using the fetched movie IDs directly
                    const moviesFromResponse = data; // Use the data response directly
                    const movieIdsFromResponse = moviesFromResponse.map(m => m.movieId);

                    const runsQuery = formFilterQuery("AND", {
                        field: "movieId",
                        operator: "in",
                        values: movieIdsFromResponse
                    });

                    const fetchedRuns = await runService.getAll(runsQuery, "", 1, 100000);
                    setRuns(fetchedRuns);

                    // Use the correct field (runId) from the fetched runs for the screenings query
                    if (fetchedRuns.length > 0) {
                        const runIds = fetchedRuns.map(r => r.runId);

                        let screeningsQuery = formFilterQuery("AND", {
                            field: 'runId',
                            operator: "in",
                            values: runIds, // Fixed: using runId instead of movieId
                        });

                        const fetchedScreenings = await screeningService.getAll(screeningsQuery, "startDate asc", 1, 1000);
                        console.log('Fetched screenings:', fetchedScreenings);
                        setScreenings(fetchedScreenings);
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
        };

        fetchMovies();
    }, [currentPage, movieService, genres, ageRestrictions, languages, publishers, countries, minBudget, maxBudget, selectedBudgetRange, minRuntime, maxRuntime, selectedRuntimeRange, title, pageSize]);

    if (loading) {
        <span className="loading loading-spinner loading-xl"></span>
    }

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
                        {movies.length && <h2 className="font-semibold text-xl mb-4">{movies.length} {t('movieList.moviesFound')}</h2>}

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

                <div className="p-6 flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
                        {movies.map((movie, i) => {
                            const movieScreenings = getScreeningsForMovie(movie.movieId);
                            return (
                                <div key={i} className="rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg">
                                    <MoviePreview movieId={movie.movieId} />

                                    {movieScreenings && movieScreenings.length > 0 ? (
                                        <div className="p-4">
                                            <Accordion type="single" collapsible>
                                                <AccordionItem value="item-1">
                                                    <AccordionTrigger className="flex items-center gap-2 py-2 cursor-pointer">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <div className="flex">
                                                            <h3 className="text-sm font-medium">{t('movieList.availableScreenings')} ({movieScreenings.length})</h3>
                                                        </div>
                                                    </AccordionTrigger>
                                                    <AccordionContent className="grid grid-cols-1 gap-3">
                                                        {movieScreenings.map(screening => (
                                                            <ScreeningTimeComponent key={screening.screeningId} screening={screening} onSelect={setSelectedScreening} />
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
    );
};

export default MovieList;
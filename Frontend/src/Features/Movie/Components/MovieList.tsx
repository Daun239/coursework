// import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

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
import Sidebar from "@/components/Sidebar"
import { useState, useEffect } from "react";
import { useMovieFiltersLoader } from "../Hooks/useMovieFiltersLoader";
import MoviePreview from "./MoviePreview";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"


function handleSelectionChange<T>(selected: T[], setState: React.Dispatch<React.SetStateAction<T[]>>) {
    setState(selected);
}

const MovieList = () => {
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





    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const movieGenreQuery = formFilterQuery(
                    "AND", {

                    field: "genreId",
                    values: genres.map(g => g.genreId).filter(id => id != null), // Extract genreId and filter out null values
                    operator: 'in',

                }
                    ,
                );


                const correspondingMoviesByGenre = await moviesGenreService.getAll(movieGenreQuery, "", currentPage, 100000);

                const uniqueMovies = correspondingMoviesByGenre.filter((movie, index, self) =>
                    index === self.findIndex((m) => m.movieId === movie.movieId)
                );

                const movieIds = uniqueMovies.map(m => m.movieId);



                const filterQuery = formFilterQuery(
                    "AND",
                    {
                        field: 'movieId',
                        values: movieIds,
                        operator: 'in' // 'in' for multiple values
                    },
                    {
                        field: 'title',
                        values: title ? [title] : [], // Use title only if it's non-empty
                        operator: "contains" // 'contains' for partial matching
                    },
                    {
                        field: 'budget',
                        values: selectedBudgetRange.map(v => v.toString()).filter(v => v !== '0'), // Ensure they are strings
                        operator: 'range' // 'range' for numeric ranges like budget or runtime
                    },
                    {
                        field: 'runtime',
                        values: selectedRuntimeRange.map(v => v.toString()).filter(v => v !== '0'), // Ensure they are strings
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


                // Make sure the filter query isn't empty before sending the request
                if (filterQuery) {
                    console.log('Filter Query:', filterQuery);

                    const data = await movieService.getAll(filterQuery, "", currentPage, pageSize); // any page/pageSize

                    console.log("data", data);
                    setMovies(data);
                }

                const runsQuery = formFilterQuery("AND",

                    {
                        field: "movieId",
                        operator: "in",
                        values: movies.map(m => m.movieId)
                    }

                );

                const runs = await runService.getAll(runsQuery, "", 1, 100000);

                setRuns(runs);

                let screeningsQuery = formFilterQuery("AND", {
                    field: 'runId',
                    operator: "in",
                    values: runs.map(r => r.movieId),
                })



                // const now = new Date();
                // const tenYearsLater = addYears(now, 10);

                // screeningsQuery = screeningsQuery + ' AND ' + formFilterQuery("AND", {
                //     field: 'screeningStartDate',
                //     operator: 'range',
                //     values: [now.toISOString(), tenYearsLater.toISOString()],
                // });

                const screenings = await screeningService.getAll(screeningsQuery, "startDate asc", 1, 1000);

                setScreenings(screenings);

                console.log('fetched screenings', screenings);

            } catch (error) {
                console.error('Failed to fetch movies:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [movieService, genres, ageRestrictions, languages, publishers, countries, minBudget, maxBudget, selectedBudgetRange, minRuntime, maxRuntime, selectedRuntimeRange, title, pageSize]);


    if (loading) {
        <span className="loading loading-spinner loading-xl"></span>
    }

    return (
        <div className="relative w-full">
            {/* Sidebar with filters */}
            <Sidebar
                width={320}
                tabPosition="middle"
                tabColor="bg-primary"
                isOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
            >

                <div className="filters-container">

                    {movies.length && <h2 className="font-semibold text-xl mb-4">{movies.length} movies found</h2>}




                    <DropdownList
                        listName="Filter by age restrictions"
                        service={ageRestrictionService}
                        displayKey="ageRestriction1"
                        onSelectionChange={(selected: any[]) => handleSelectionChange(selected, setAgeRestrictions)}
                    />

                    <DropdownList
                        listName="Filter by genres"
                        service={genreService}
                        displayKey="genre1"
                        onSelectionChange={(selected: any[]) => handleSelectionChange(selected, setGenres)}
                    />

                    <DropdownList
                        listName="Filter by countries"
                        service={countryService}
                        displayKey="country1"
                        onSelectionChange={(selected: any[]) => handleSelectionChange(selected, setCountries)}
                    />

                    <DropdownList
                        listName="Filter by publishers"
                        service={publisherService}
                        displayKey="publisher1"
                        onSelectionChange={(selected: any[]) => handleSelectionChange(selected, setPublishers)}
                    />

                    <DropdownList
                        listName="Filter by original language"
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
                            placeholder="Search movie title or description"
                            onChange={(e) => setTitle(e.target.value)}
                            className="pl-6"
                        />
                    </label>

                    {/* Range Sliders */}
                    <RangeSlider
                        min={minBudget}
                        max={maxBudget}
                        onRangeCommit={(range) => setSelectedBudgetRange(range)}
                        sliderName="Budget"
                        currency="$"
                    />

                    <RangeSlider
                        min={minRuntime}
                        max={maxRuntime}
                        onRangeCommit={(range) => setSelectedRuntimeRange(range)}
                        sliderName="Runtime"
                        currency="minutes"
                    />
                </div>



                <div className="mt-2">
                    <label className="block font-medium mb-4">Items per page:</label>
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setCurrentPage(1); // Reset to first page when size changes
                        }}
                        className=" bg-gray-200 dark:bg-gray-800 select select-bordered w-full"
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

            </Sidebar>


            <div
                className={`
    fixed inset-0 z-10 flex items-center justify-center bg-black/50
    transition-opacity duration-300
    ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
  `}
            ></div>


            {selectedScreening && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="rounded-xl shadow-xl max-w-3xl w-full relative bg-white">
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

            {/* Main content */}
            <div className="p-6  w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
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
                                                        <h3 className="text-sm font-medium">Available Screenings ({movieScreenings.length})</h3>
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
                                        No screenings available
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
    );
};

export default MovieList;

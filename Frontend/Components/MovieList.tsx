import React, { useEffect, useState } from 'react';
import { useServiceStore } from '../Stores/ServicesStore';
import { Movie } from '../Types/Movie';
import MoviePreview from "../Components/MoviePreview"
import DropdownList from "./DropdownList"
import { Genre } from '../Types/Genre';
import { AgeRestriction } from '../Types/AgeRestriction';
import { Country } from '../Types/Country';
import { Publisher } from '../Types/Publisher';
import { Language } from '../Types/Language';
import RangeSlider from "./RangeSlider"
import Sidebar from './Sidebar';
import formFilterQuery from '../Lib/formFilterQuery';
import Pagination from './Pagination';
import { Screening } from '../Types/Screening';
import ScreeningTimeComponent from './ScreeningTimeComponent';
import { addYears } from 'date-fns';
import ScreeningTickets from '../Features/Screenings/Components/ScreeningTickets';
import getMinAndMaxFromService from '../Lib/getMinAndMaxFromService';
import { useMovieFiltersLoader } from '../Hooks/useMovieFiltersLoader';




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
                });




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



                const now = new Date();
                const tenYearsLater = addYears(now, 10);

                // screeningsQuery = screeningsQuery + ' AND ' + formFilterQuery("AND", {
                //     field: 'screeningStartDate',
                //     operator: 'range',
                //     values: [now.toISOString(), tenYearsLater.toISOString()],
                // });

                const screenings = await screeningService.getAll(screeningsQuery, "", 1, 1000);

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
        <div className="relative">
            {/* Sidebar with filters */}
            <Sidebar width={320} tabPosition="middle" tabColor="bg-primary">
                <div className="filters-container">
                    <h2 className="font-semibold text-xl mb-4">{movies.length} movies found</h2>

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

                    <label className="input mt-4">
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
                            placeholder="Search"
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



                <div className="mt-4">
                    <label className="block font-medium mb-1">Items per page:</label>
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setCurrentPage(1); // Reset to first page when size changes
                        }}
                        className="select select-bordered w-full"
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

            {selectedScreening && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full relative">
                        <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
                            onClick={() => setSelectedScreening(null)}
                        >
                            ×
                        </button>

                        <ScreeningTickets id={selectedScreening.screeningId} />
                    </div>
                </div>
            )}


            {/* Main content */}
            <div className="p-6 bg-gray-50">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {movies.map((movie, i) => {
                        const movieScreenings = getScreeningsForMovie(movie.movieId);
                        return (
                            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg">


                                <MoviePreview movieId={movie.movieId} />

                                {movieScreenings.length > 0 ? (
                                    <div className="p-4">
                                        <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            Available Screenings
                                        </h3>



                                        <div className="grid grid-cols-1 gap-3">
                                            {movieScreenings.map(screening => (
                                                <ScreeningTimeComponent key={screening.screeningId} screening={screening} onSelect={setSelectedScreening} />
                                            ))}
                                        </div>
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

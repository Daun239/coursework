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





function handleSelectionChange<T>(selected: T[], setState: React.Dispatch<React.SetStateAction<T[]>>) {
    setState(selected);
}

const MovieList = () => {
    const { movieService, genreService, moviesGenreService, languageService, countryService, publisherService, ageRestrictionService } = useServiceStore();
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    const [genres, setGenres] = useState<Genre[]>([]);
    const [ageRestrictions, setAgeRestrictions] = useState<AgeRestriction[]>([])
    const [languages, setLanguages] = useState<Language[]>([]);
    const [publishers, setPublishers] = useState<Publisher[]>([]);
    const [countries, setCountries] = useState<Country[]>([]);
    const [minBudget, setMinBudget] = useState<number>(0);
    const [maxBudget, setMaxBudget] = useState<number>(0);

    const [selectedBudgetRange, setSelectedBudgetRange] = useState<[number, number]>([minBudget, maxBudget]);

    const [minRuntime, setMinRuntime] = useState<number>(0);
    const [maxRuntime, setMaxRuntime] = useState<number>(0);

    const [selectedRuntimeRange, setSelectedRuntimeRange] = useState<[number, number]>([minRuntime, maxRuntime]);

    const [title, setTitle] = useState<string>("");

    const [pageSize, setPageSize] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pagesCount, setPagesCount] = useState<number>(10);


    const [moviesCount, setMoviesCount] = useState<number>(0);


    // ---------



    //----------


    async function getMinAndMaxFromService<T>(
        service: { getAll: (filter: string, sortBy: string, page: number, pageSize: number) => Promise<T[]> },
        field: string
    ): Promise<{ min: T | null; max: T | null }> {
        try {
            const [minArr, maxArr] = await Promise.all([
                service.getAll("", `${field} asc`, 1, 1),
                service.getAll("", `${field} desc`, 1, 1)
            ]);

            return {
                min: minArr.length > 0 ? minArr[0] : null,
                max: maxArr.length > 0 ? maxArr[0] : null
            };
        } catch (error) {
            console.error(`Failed to get min and max for ${field}:`, error);
            return { min: null, max: null };
        }
    }





    useEffect(() => {
        setPagesCount(Math.ceil(moviesCount / pageSize));

        console.log("pagescount", pagesCount)
    }, [pageSize, movies]);




    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const movieGenreQuery = formFilterQuery({
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
                    {
                        field: 'movieId',
                        values: movieIds,
                        operator: 'in' // 'in' for multiple values
                    },
                    {
                        field: 'title',
                        values: title ? [title] : [], // Use title only if it's non-empty
                        operator: 'contains' // 'contains' for partial matching
                    },
                    {
                        field: 'budget',
                        values: [selectedBudgetRange[0], selectedBudgetRange[1]].filter(v => v !== 0), // Exclude zero values for budget
                        operator: 'range' // 'range' for numeric ranges like budget or runtime
                    },
                    {
                        field: 'runtime',
                        values: [selectedRuntimeRange[0], selectedRuntimeRange[1]].filter(v => v !== 0), // Exclude zero values for runtime
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

            } catch (error) {
                console.error('Failed to fetch movies:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [movieService, genres, ageRestrictions, languages, publishers, countries, minBudget, maxBudget, selectedBudgetRange, minRuntime, maxRuntime, selectedRuntimeRange, title, pageSize]);



    useEffect(() => {
        const fetchMinMax = async () => {
            // Fetching both budget and runtime min/max values
            const { min: minBudget, max: maxBudget } = await getMinAndMaxFromService<Movie>(movieService, "budget");
            const { min: minRuntime, max: maxRuntime } = await getMinAndMaxFromService<Movie>(movieService, "runtime");

            // Default to 0 if min or max values are null or undefined
            setMinBudget(minBudget?.budget ?? 0);
            setMaxBudget(maxBudget?.budget ?? 0);
            setSelectedBudgetRange([minBudget?.budget ?? 0, maxBudget?.budget ?? 0]);

            setMinRuntime(minRuntime?.runtime ?? 0);
            setMaxRuntime(maxRuntime?.runtime ?? 0);
            setSelectedRuntimeRange([minRuntime?.runtime ?? 0, maxRuntime?.runtime ?? 0]);

            const moviesCount = await movieService.getCount("");
            setMoviesCount(moviesCount)
        };

        fetchMinMax();
    }, []);




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
                        displayKey="ageRestriction"
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


            {/* Main content */}
            <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {movies.map((movie, i) => (
                        <MoviePreview key={i} movieId={movie.movieId} />
                    ))}
                </div>
            </div>

        </div>
    );
};

export default MovieList;

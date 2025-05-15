import React, { useEffect, useState } from 'react';
import { useServiceStore } from '@/Stores/ServicesStore';
import { AgeRestriction } from '@/Types/AgeRestriction';
import { Country } from '@/Types/Country';
import { Genre } from '@/Types/Genre';
import { Language } from '@/Types/Language';
import { Publisher } from '@/Types/Publisher';
import { Movie } from '@/Types/Movie';
import { MoviesGenre } from '@/Types/MoviesGenre';
import { useLanguageStore } from '@/Stores/useLanguageStore';
import formFilterQuery from '@/lib/formFilterQuery';
import { Run } from '@/Types/Run';

import { toast } from "sonner"
import { UserActionLog } from '@/Types/UserActionLog';
import { useUserStore } from '@/Stores/UserStore';

// Translation object with English and Ukrainian support
const translations = {
    en: {
        title: "Create Movie",
        name: "Name",
        description: "Description",
        budget: "Budget",
        runtime: "Runtime (min)",
        runStart: "Run start date",
        runEnd: "Run end date",
        selectPublisher: "Select Publisher",
        selectLanguage: "Select Language",
        selectCountry: "Select Country",
        selectAgeRestriction: "Select Age Restriction",
        genres: "Genres (Ctrl/Cmd + Click to select multiple)",
        create: "Create Movie",
        update: "Update Movie",
        success: "Movie created successfully!",
        updateSuccess: "Movie updated successfully!",
        failure: "Failed to process movie.",

        runStartDateHasToBeBeforeEndDate: "Run start date has to be sooner than end date",
    },
    ua: {
        title: "Створити фільм",
        name: "Назва",
        description: "Опис",
        budget: "Бюджет",
        runtime: "Тривалість (хв)",
        runStart: "День початку прокату",
        runEnd: "День кінця прокату",
        selectPublisher: "Оберіть видавця",
        selectLanguage: "Оберіть мову",
        selectCountry: "Оберіть країну",
        selectAgeRestriction: "Оберіть вікове обмеження",
        genres: "Жанри (Ctrl/Cmd + Клацніть для вибору декількох)",
        create: "Створити фільм",
        update: "Оновити фільм",
        success: "Фільм успішно створено!",
        updateSuccess: "Фільм успішно оновлено!",
        failure: "Не вдалося обробити фільм.",

        runStartDateHasToBeBeforeEndDate: "Кінець прокату повинен бути після початку прокату",
    }
};

const CreateOrUpdateMovie = ({ movieId, handleRerender }: { movieId?: number, handleRerender: () => void }) => {
    const [formData, setFormData] = useState<Movie>({
        name: '',
        description: '',
        budget: 1,
        runtime: 90,
        publisherId: '',
        languageId: '',
        countryId: '',
        ageRestrictionId: '',
        movieId: 0,
        genreIds: [],
        runStartDate: null,
        runEndDate: null
    });

    const [languages, setLanguages] = useState<Language[]>([]);
    const [publishers, setPublishers] = useState<Publisher[]>([]);
    const [countries, setCountries] = useState<Country[]>([]);
    const [ageRestrictions, setAgeRestrictions] = useState<AgeRestriction[]>([]);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<number[]>([]);

    const { language } = useLanguageStore();
    const t = translations[language as keyof typeof translations] || translations.en;

    const {
        movieService,
        moviesGenreService,
        genreService,
        ageRestrictionService,
        countryService,
        publisherService,
        languageService,
        runService,
        userActionService
    } = useServiceStore();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [langs, pubs, cntrs, ages, grs] = await Promise.all([
                    languageService.getAll('', '', 1, 100),
                    publisherService.getAll('', '', 1, 100),
                    countryService.getAll('', '', 1, 100),
                    ageRestrictionService.getAll('', '', 1, 100),
                    genreService.getAll('', '', 1, 100),
                ]);
                setLanguages(langs.items ?? langs);
                setPublishers(pubs.items ?? pubs);
                setCountries(cntrs.items ?? cntrs);
                setAgeRestrictions(ages.items ?? ages);
                setGenres(grs.items ?? grs);

                if (movieId) {
                    const [existingMovie] = await movieService.getAll(`movieId = ${movieId}`);

                    const movieGenres = await moviesGenreService.getAll(`movieId = ${movieId}`);

                    const [run] = await runService.getAll(`movieId = ${movieId}`);

                    const genreQuery = formFilterQuery("AND", {
                        field: "genreId",
                        operator: "in",
                        values: movieGenres.map(m => m.genreId)
                    });
                    const genres = await genreService.getAll(genreQuery);

                    if (existingMovie) {
                        setFormData(existingMovie);
                        setSelectedGenres(genres.map(g => g.genreId));

                        setFormData({
                            ...formData, runStartDate: run.startDate,
                            runEndDate: run.endDate,
                            publisherId: existingMovie.publisherId,
                            languageId: existingMovie.languageId,
                            countryId: existingMovie.countryId,
                            ageRestrictionId: existingMovie.ageRestrictionId,
                            budget: existingMovie.budget,
                            description: existingMovie.description,
                            name: existingMovie.name,
                            runtime: existingMovie.runtime,
                            movieId: movieId,
                        })
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [languageService, publisherService, countryService, ageRestrictionService, genreService, movieId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'budget' || name === 'runtime' ? +value : value
        }));
    };

    const handleGenresChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = Array.from(e.target.selectedOptions, opt => +opt.value);
        setSelectedGenres(selected);
        setFormData(prev => ({
            ...prev,
            genreIds: selected
        }));
    };



    const { user } = useUserStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {

            if (formData.runEndDate <= formData.runStartDate) {
                toast.error(t.runStartDateHasToBeBeforeEndDate)
                return;
            }
            let movieResponse;

            if (movieId) {
                movieResponse = await movieService.update(formData);
                handleRerender();
                toast(t.updateSuccess);

                const actionLog: UserActionLog = {
                    action: "Added",
                    details: `${JSON.stringify(movieResponse)}`,
                    entity: "Movie",
                    timestamp: new Date(),
                    user: `${user?.name} ${user?.surname}`
                }

                userActionService.post(actionLog);

            } else {
                movieResponse = await movieService.create(formData);
                handleRerender();
                toast(t.success);

                const actionLog: UserActionLog = {
                    action: "Added",
                    details: `${JSON.stringify(movieResponse)}`,
                    entity: "Movie",
                    timestamp: new Date(),
                    user: `${user?.name} ${user?.surname}`
                }

                userActionService.post(actionLog);

            }

            const run: Run = {
                endDate: formData.runEndDate,
                movieId: movieResponse.movieId,
                runId: 0,
                startDate: formData.runStartDate
            };
            await runService.create(run);

            if (selectedGenres.length > 0) {
                for (const genreId of selectedGenres) {
                    const movieGenre: MoviesGenre = {
                        genreId: genreId,
                        movieId: movieResponse.movieId,
                        moviesGenresId: 0,
                    };
                    await moviesGenreService.create(movieGenre);
                }
            }

            setFormData({
                name: '',
                description: '',
                budget: 1,
                runtime: 90,
                publisherId: 0,
                languageId: 0,
                countryId: 0,
                ageRestrictionId: 0,
                movieId: 0,
                genreIds: [],
                runStartDate: null,
                runEndDate: null,
            });
            setSelectedGenres([]);

        } catch (err) {
            console.error(err);
            toast(t.failure);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6 bg-black dark:bg-gray-800 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {movieId ? t.update : t.title}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">{t.name}</label>
                    <input
                        name="name"
                        placeholder={t.name}
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">{t.description}</label>
                    <textarea
                        name="description"
                        placeholder={t.description}
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex flex-col flex-1">
                        <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">{t.budget}</label>
                        <input
                            name="budget"
                            placeholder={t.budget}
                            type="number"
                            min={1}
                            value={formData.budget}
                            onChange={handleChange}
                            required
                            className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col flex-1">
                        <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">{t.runtime}</label>
                        <input
                            name="runtime"
                            type="number"
                            min={31}
                            value={formData.runtime}
                            onChange={handleChange}
                            required
                            className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex flex-col flex-1">
                        <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">{t.runStart}</label>
                        <input
                            name="runStartDate"
                            type="date"
                            value={formData.runStartDate ?? ''}
                            onChange={handleChange}
                            required
                            className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col flex-1">
                        <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">{t.runEnd}</label>
                        <input
                            name="runEndDate"
                            type="date"
                            value={formData.runEndDate ?? ''}
                            onChange={handleChange}
                            required
                            className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Publisher, Language, Country, Age Restriction Fields */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex flex-col flex-1">
                        <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">{t.selectPublisher}</label>
                        <select
                            name="publisherId"
                            value={formData.publisherId}
                            onChange={handleChange}
                            required
                            className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="" disabled>{t.selectLanguage}</option>
                            {publishers.map(pub => (
                                <option key={pub.publisherId} value={pub.publisherId}>
                                    {pub.publisher1}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col flex-1">
                        <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">{t.selectLanguage}</label>
                        <select
                            name="languageId"
                            value={formData.languageId}
                            onChange={handleChange}
                            required
                            className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="" disabled>{t.selectLanguage}</option>
                            {languages.map(lang => (
                                <option key={lang.languageId} value={lang.languageId}>
                                    {lang.language1}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex flex-col flex-1">
                        <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">{t.selectCountry}</label>
                        <select
                            name="countryId"
                            value={formData.countryId}
                            onChange={handleChange}
                            required
                            className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="" disabled>{t.selectCountry}</option>
                            {countries.map(country => (
                                <option key={country.countryId} value={country.countryId}>
                                    {country.country1}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col flex-1">
                        <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">{t.selectAgeRestriction}</label>
                        <select
                            name="ageRestrictionId"
                            value={formData.ageRestrictionId}
                            onChange={handleChange}
                            required
                            className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="" disabled>{t.selectAgeRestriction}</option>
                            {ageRestrictions.map(ar => (
                                <option key={ar.ageRestrictionId} value={ar.ageRestrictionId}>
                                    {ar.ageRestriction1}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Genre selection */}
                <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">{t.genres}</label>
                    <select
                        multiple
                        name="genreIds"
                        value={selectedGenres}
                        onChange={handleGenresChange}
                        className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {genres.map(genre => (
                            <option key={genre.genreId} value={genre.genreId}>
                                {genre.genre1}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-md">
                    {movieId ? t.update : t.create}
                </button>
            </form>
        </div>
    );
};

export default CreateOrUpdateMovie;

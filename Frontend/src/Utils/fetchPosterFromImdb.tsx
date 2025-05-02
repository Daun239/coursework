
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

export default fetchPosterFromTMDb;
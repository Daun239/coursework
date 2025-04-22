import React, { useEffect, useState } from 'react'
import { useServiceStore } from '../Stores/ServicesStore'
import { useParams } from 'react-router-dom';
import { Movie } from '../Types/Movie';

const MovieFullDetail = ( ) => {

      const { id } = useParams(); // Get the screening ID from the URL

    const { movieService } = useServiceStore();
    const [movie, setMovie] = useState<Movie>();
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchMovies = async () => {
        try {
          
          const data = await movieService.getAll(`MovieId = ${id}`, "", 1, 100); // або будь-який page/pageSize
  
          if (data) {
            const movie = data[0];

            setMovie(movie);

            console.log("movie", movie);
          }

        } catch (error) {
          console.error('Failed to fetch movies:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchMovies();
    }, [movieService]);
  
    if (loading) {
        <span className="loading loading-spinner loading-xl"></span>
    }
  
    return (
      <div>
       <h2>{movie?.name}</h2>
       <h2>{movie?.ageRestrictionId}</h2>
      </div>
    );
}

export default MovieFullDetail

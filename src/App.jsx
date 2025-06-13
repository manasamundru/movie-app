import { useState,useEffect } from 'react' 
import {useDebounce} from 'react-use';                       
import './App.css'
import  Spinner  from './Components/spinner';
import { Search } from './Components/Search'
import { MovieCard } from './Components/MovieCard';
import { getTrendingMovies, updateSearchCount } from './appwrite.js';
const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
   method:'GET',
   headers:{
      accept:'application/json',
      Authorization:`Bearer ${API_KEY}`
   }
}
function App(){
  const [searchTerm,setSearchTerm] = useState('');
  const [errorMeassage,setErrorMessage] = useState('');
  const [movieList,setMovieList] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  const [debouncedSearchTerm,setDebouncedSearchTerm] = useState("");
  const [trendingMovies,setTrendingMovies] = useState([]);
  const fetchMovies = async (query = "")=>{
    setIsLoading(true);
    setErrorMessage('');
    try{
       const endpoint  = query
       ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
       :`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
       const response =  await fetch(endpoint,API_OPTIONS);
      if(!response.ok){
        throw new Error('Failed to fetch movies');
      }
      const data = await response.json();
      if(data.response === 'False'){
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }
      setMovieList(data.results || []);
      if(query && data.results.length>0){
        await updateSearchCount(query,data.results[0]);
      }
    }
    catch(err){
       console.log(`Error fetching movies: ${err}`);
       setErrorMessage("error fetching movies.Please try again later.");
    }
    finally{
      setIsLoading(false);
    }
  }
  const loadTrendingMovies = async()=>{
    try{
     const movies = await getTrendingMovies();
     setTrendingMovies(movies);
    }catch(err){
      console.log(`error fetching movies:${err}`);
    }
  }
  useEffect(()=>{
    loadTrendingMovies();
  },[]);
  useDebounce(()=>setDebouncedSearchTerm(searchTerm),1000,[searchTerm]);
  useEffect(()=>{
     fetchMovies(debouncedSearchTerm);
  },[debouncedSearchTerm]);
   return (
    <main>
      <div className = "pattern"/>
      <div className = 'wrapper'>
        <header>
          <img src = "./hero-img.png" alt = "Hero Banner"/>
          <h1>Find <span className='text-gradient'> Movies </span>you will enjoy</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>
        {trendingMovies.length>0 && (
          <section className='trending'>
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie,index)=>(
                <li key = {movie.$id}>
                  <p>{index+1}</p>
                  <img src ={movie.poster_url}alt={movie.title}/> 
                </li>
              ))}
            </ul>
          </section>
        )}
        <section className="all-movies">
          <h2>All Movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMeassage ? (
            <p className="text-red-500">{errorMeassage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
        
      </div>
    <h1 className="text-3xl font-bold underline">
    Hello world!
  </h1>
  </main>
   )
}

export default App

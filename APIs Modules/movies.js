'use strict';

const superagent = require('superagent');

module.exports = getMovie;

function getMovie(query) {
    // console.log('queryyyyyyyyyyyyyyyyyyyyyyy Movies : ', query);
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIES_API_KEY}&query=${query.search_query}`;
  
    return superagent.get(url)
      .then(data => {
        // console.log('movies Data \n\n : ', data.body);
        return data.body.results.map(movie => {
          return new Movies(movie);
        })
      })
      .catch(error => {
        errorHandler(error,req,res);
      })
  
  }// End of get movies function
  
  function Movies(data) {
    this.title = data.title;
    this.overview = data.overview;
    this.average_votes = data.vote_average;
    this.popularity = data.popularity;
    this.released_date = data.release_date;
    this.image_url = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
  
  } // End of Movies constructor function 

// Server Error , Any Error
function errorHandler(error,request,response) {
  response.status(500).send(error);
}
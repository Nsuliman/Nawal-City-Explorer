'use strict';

/***************************************** The Basic *****************************************/
require('dotenv').config();

const express = require('express');

const cors = require('cors');

const superagent = require('superagent');

const PORT = process.env.PORT || 3000;

const server = express();

server.use(cors());

/********************************************* Ruotes  *********************************************/

/********* Function *********/
server.get('/location', locationHandler);
server.get('/weather', weatherHandler);
server.get('/events', eventHandler);
server.get('/movies', movieHandler);
// server.get('/yelp', yelpHandler);
server.get('/trails', trailHandler);


// test the sever is works , yes it does :) 
server.get('/', (request, response) => {
  response.status(200).send('The Root/Home Ruote , It\'s Works ');
});

/********************************* The Location *************************************/
// Location 

function locationHandler(request, response) {
  // console.log('request : ', request);
  // console.log('request.query: ', request.query);
  getLocation(request.query.city)             // Get city input from user
    .then(locationData => response.status(200).json(locationData));            // To show up the generated data 
} // End of location handler function 

function getLocation(city) {

  // const url = `https://eu1.locationiq.com/v1/search.php?key=${process.env.TOKEN}&q=${city}&format=json`
  const url = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${city}&format=json`

  return superagent.get(url)
    .then(data => {
      // console.log('\n\n\n\n\n\n\n\n data : ', data);
      // console.log('data.body : ', data.body[0]);
      return new Location(city, data.body[0]);
    })
    .catch(error => {
      errorHandler(error,req,res);
    })

} // End of get location function 



// Location Constructor Function 
function Location(city, data) {
  this.search_query = city;
  this.formatted_query = data.display_name;
  this.latitude = data.lat;
  this.longitude = data.lon;
} // end of con.fun of Location 

/********************************* The Weather *************************************/
// Weather 

function weatherHandler(request, response) {
  // console.log('request : ', request);
  // console.log('request.query : ', request.query);
  getWeather(request.query)
    .then(weatherData => response.status(200).json(weatherData));

} // End of weather handler function 

function getWeather(query) {
  const url = `https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}/${query.latitude},${query.longitude}`;

  // console.log('url  : ', url );

  return superagent.get(url)
    .then(data => {
      // console.log('data : ', data);
      let weather = data.body;
      // console.log('weather : ', weather);
      return weather.daily.data.map((day) => {
        return new Weather(day);
      })
    })
    .catch(error => {
      errorHandler(error,req,res);
    })
}// End of get weather function 

function Weather(day) {
  this.name = 'weather';
  this.forecast = day.summary;
  this.time = new Date(day.time * 1022.1).toDateString();
} // End of weather constructor function 


/******************************************* The Events ********************************************/

function eventHandler(request, response) {
  getEvent(request.query)
    .then(eventData => response.status(200).json(eventData));

} // End of event handler function 

function getEvent(query) {
  const url = `http://api.eventful.com/json/events/search?app_key=${process.env.EVENTFUL_API_KEY}&location=${query.formatted_query}`
  // console.log('url eventttttttttttttttttttttttttttttttttttttttttttt : \n\n\n\n\n\n', url );
  // console.log('queryyyyyyyyyyyyyyyyyyyyyyyyyyy : ', query);


  // console.log('super agent urllllllllllll' ,superagent.get(url));
  return superagent.get(url)
    .then(data => {
      // console.log('data 2 : ', data );   
      const eventful = JSON.parse(data.text);
      // console.log('eventful ', eventful);
      return eventful.events.event.map((eventday) => {
        // console.log('eventday : ', eventday);
        return new Eventful(eventday);
      })
    })
    .catch(error => {
      errorHandler(error,req,res);
    })
}// End of get eventful function 

function Eventful(day) {
  this.link = day.url;
  this.name = day.title;
  this.event_date = day.start_time;
  this.summary = day.description;

} // End of Eventful constructor function 

/********************************* The Movies *************************************/

function movieHandler(request, response) {
  getMovie(request.query)
    .then(movieData => response.status(200).send(movieData));

} // End of movie handler function 


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

/********************************* The Yelp *************************************/
function yelpHandler(request, response) {
  getYelp(request.query)
    .then(yelpData => response.status(200).send(yelpData));

} // End of Yelp handler function 

function getYelp(query) {
  const url = `https://api.yelp.com/v3/businesses/search?location=${query.search_query}`


  return superagent.get(url)
    .set('Authorization', `nawal ${process.env.YELP_API_KEY}`)
    .then(data => {
      console.log('data : ', data);
      let yelpPath = data.body.businesses;
      return yelpPath.map(yelp => {
        return new Yelp(yelp)
      })
    })
    .catch(error => {
      errorHandler(error,req,res);
    })
} // end of getYelp function 

function Yelp() {
  this.name = ' Yelppppppp';
}


/********************************* The Trials *************************************/

function trailHandler(request, response) {
  getTrail(request.query)
    .then(trailData => response.status(200).send(trailData));
} // End of trails handler function 

function getTrail(query) {

  // console.log('query Trailssssssssssssssssss \n\n\n\n\n: ', query);
  const url = `https://www.hikingproject.com/data/get-trails?lat=${query.latitude}&lon=${query.longitude}&maxDistance=200&key=${process.env.TRAIL_PRIVATE_KEY}`

  return superagent.get(url)
    .then(data => {
      // console.log('data : ', data);
      let traiPath = data.body;
      return traiPath.trails.map(trail => {
        return new Trail(trail)
      })
    })
    .catch(error => {
      errorHandler(error,req,res);
    })
} // end of getTrail function


function Trail(data) {
  // this.name = ' Trails ';
  this.name = data.name
  this.location = data.location;
  this.length = data.length;
  this.stars = data.stars;
  this.star_votes = data.starVotes
  this.summary = data.summary;
  this.trail_url = data.url;
  this.conditions = data.conditionDetails;

} // ens of Trails constructor function 


/***************************************** Errors Handlers *****************************************/

// User Error 
server.use('*', (request, response) => {
  response.status(404).send('Not Found');
});

// Server Error , Any Error
function errorHandler(error,request,response) {
  response.status(500).send(error);
}

server.listen(PORT, () => console.log(`I am a live , Server Listening on port ${PORT}`));

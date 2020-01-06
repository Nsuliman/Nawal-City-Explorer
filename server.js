'use strict';

/***************************************** The Basic *****************************************/
require('dotenv').config();

const express = require('express');

const cors = require('cors');

// const superagent = require('superagent');                   // Moved to every module JS file foreach feature 

const PORT = process.env.PORT || 3000;

const server = express();

server.use(cors());

/********************************************* Ruotes  *********************************************/

/********* APIs Modules *********/
let locationFun = require('./APIs Modules/location');
let weatherFun = require('./APIs Modules/weather');
let eventsFun = require('./APIs Modules/events');
let moviesFun = require('./APIs Modules/movies');
let yelpFun = require('./APIs Modules/yelp');
let trailsFun = require('./APIs Modules/trails');

/********* Functions *********/
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
  locationFun(request.query.city)             // Get city input from user WITH MODULRIZATION 
    .then(locationData => response.status(200).json(locationData));            // To show up the generated data 
} // End of location handler function 

/********************************* The Weather *************************************/

// Weather 
function weatherHandler(request, response) {
  // console.log('request : ', request);
  // console.log('request.query : ', request.query);
  weatherFun(request.query)
    .then(weatherData => response.status(200).json(weatherData));

} // End of weather handler function 

/******************************************* The Events ********************************************/

// Events 
function eventHandler(request, response) {
  eventsFun(request.query)
    .then(eventData => response.status(200).json(eventData));

} // End of event handler function 

/********************************* The Movies *************************************/

// Movies
function movieHandler(request, response) {
  moviesFun(request.query)
    .then(movieData => response.status(200).send(movieData));

} // End of movie handler function 

/********************************* The Yelp *************************************/

// Yelp
function yelpHandler(request, response) {
  yelpFun(request.query)
    .then(yelpData => response.status(200).send(yelpData));

} // End of Yelp handler function 

/********************************* The Trials *************************************/

// Trials
function trailHandler(request, response) {
  trailsFun(request.query)
    .then(trailData => response.status(200).send(trailData));
} // End of trails handler function 

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

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
// server.get('/weather', weatherHandler);
// server.get('/events', eventHandler);


// test the sever is works , yes it does :) 
server.get('/', (req, res) => {
  res.status(200).send('The Root/Home Ruote , It\'s Works ');
});

/********************************* The Location *************************************/
// Location 

function locationHandler(request, response) {
  console.log('request.query.data : ', request.query.data);
  getLocation(request.query.data)             // Get city input from user
    .then(locationData => response.status(200).json(locationData));            // To show up the generated data 
} // End of location handler function 

function getLocation(city) {

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${process.env.GEOCODE_API_KEY}`

  return superagent.get(url)
    .then(data => {
      // console.log('\n\n\n\n\n\n\n\n data : ', data.header);
      // console.log('data.body : ', data.body);
      return new Location(city, data.body);
    })

} // End of get location function 



// Location Constructor Function 
function Location(city, data) {
  this.search_query = city;
  this.formatted_query = data.results[0].formatted_address;
  this.latitude = data.results[0].geometry.location.lat;
  this.longitude = data.results[0].geometry.location.lng;
} // end of con.fun of Location 

/********************************* The Weather *************************************/
// Weather 

server.get('/weather', (req, res) => {
  // res.send('Weather Ruote ');
  const weatherData = require('./data/darksky.json');
  console.log('weatherData : ', weatherData);
  res.status(200).json(locWeather(weatherData.daily.data));

}); // end of weather ruote 

let weatherArray = [];

function Weather(data) {
  this.forcast = data.summary;
  this.time = new Date(data.time * 1022.1).toDateString();
} // end of con.fun of Weather 

// Function for eather object , you can use another way 
function locWeather(array) {
  array.forEach(element => {
    weatherArray.push(new Weather(element))
  });

  return weatherArray;
}; // end of locWeather function

/***************************************** Errors Handlers *****************************************/

// User Error 
server.use('*', (req, res) => {
  res.status(404).send('Not Found');
});

// Server Error , Any Error
server.use((error, req, res) => {
  res.status(500).send(error);
});

server.listen(PORT, () => console.log(`I am a live , Server Listening on port ${PORT}`));

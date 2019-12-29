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

function weatherHandler(request,response) {
  console.log('request.query.data : ', request.query.data);
  getWeather(request.query.data)
    .then( weatherData => response.status(200).json(weatherData) );

} // End of weather handler function 

function getWeather(query) {
  const url = `https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}/${query.latitude},${query.longitude}`;
  // console.log('url  : ', url );

  return superagent.get(url)
    .then( data => {
      console.log('data : ', data);
      let weather = data.body;
      console.log('weather : ', weather);
      return weather.daily.data.map( (day) => {
        return new Weather(day);
      });
    });
}// End of get weather function 

function Weather(day) {
  this.forecast = day.summary;
  this.time = new Date(day.time * 1022.1).toDateString();
} // End of weather constructor function 


/******************************************* The Events ********************************************/

function eventHandler(request,response) {
  getEvent(request.query.data)
    .then( eventData => response.status(200).json(eventData) );

} // End of event handler function 

function getEvent(query) {
  const url = `http://api.eventful.com/keys?new_key=${process.env.EVENTFUL_API_KEY}/${query.latitude},${query.longitude}`;
  console.log('url eventttttttttttttttttttttttttttttttttttttttttttt : ', url );
  console.log('queryyyyyyyyyyyyyyyyyyyyyyyyyyy : ', query);

  // console.log('dataaaaaaaaaaaaaaaaaaaaaaaaaaa : ', data);

  
    // console.log('super agent urllllllllllll' ,superagent.get(url));
    return superagent.get(url)
    .then( data => {
      let eventful = data.body;
      console.log('data.body : ', data.body);
      return eventful.daily.data.map( (day) => {
        return new Eventful(day);
      });
    });
}// End of get eventful function 

function Eventful(day) {
  this.link = url;
  this.name = query.search_query;
  this.event_date = new Date(day.time * 1022.1).toDateString();
  this.summary = query.summary;

} // End of Eventful constructor function 

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

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
      return new Location(data.body[0]);
    })

} // End of get location function 



// Location Constructor Function 
function Location(data) {
  this.formatted_query = data.display_name;
  this.latitude = data.lat;
  this.longitude = data.lon;
} // end of con.fun of Location 

/********************************* The Weather *************************************/
// Weather 

function weatherHandler(request,response) {
  // console.log('request : ', request);
  // console.log('request.query : ', request.query);
  getWeather(request.query)
    .then( weatherData => response.status(200).json(weatherData) );

} // End of weather handler function 

function getWeather(query) {
  const url = `https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}/${query.latitude},${query.longitude}`;
  // const url = `https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}`;

  console.log('url  : ', url );

  return superagent.get(url)
    .then( data => {
      // console.log('data : ', data);
      let weather = data.body;
      // console.log('weather : ', weather);
      return weather.daily.data.map( (day) => {
        return new Weather(day);
      })
    })
}// End of get weather function 

function Weather(day) {
  // this.name = 'weather';
  this.forecast = day.summary;
  this.time = new Date(day.time * 1022.1).toDateString();
} // End of weather constructor function 


/******************************************* The Events ********************************************/

function eventHandler(request,response) {
  getEvent(request.query)
    .then( eventData => response.status(200).json(eventData) );

} // End of event handler function 

function getEvent(query) {
  const url = `http://api.eventful.com/json/events/search?app_key=${process.env.EVENTFUL_API_KEY}&location=${query.formatted_query}`
    // console.log('url eventttttttttttttttttttttttttttttttttttttttttttt : \n\n\n\n\n\n', url );
    console.log('queryyyyyyyyyyyyyyyyyyyyyyyyyyy : ', query);


    // console.log('super agent urllllllllllll' ,superagent.get(url));
    return superagent.get(url)
    .then( data => {   
      // console.log('data 2 : ', data );   
      const eventful = JSON.parse(data.text);
      // console.log('eventful ', eventful);
      return eventful.events.event.map( (eventday) => {
        // console.log('eventday : ', eventday);
        return new Eventful(eventday);
      });
    });
}// End of get eventful function 

function Eventful(day) {
  this.link = day.url;
  this.name = day.title;
  this.event_date = day.start_time;
  this.summary = day.description;

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

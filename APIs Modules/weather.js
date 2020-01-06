'use strict';

const superagent = require('superagent');

module.exports = getWeather;

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
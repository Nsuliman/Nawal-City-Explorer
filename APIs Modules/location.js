'use strict';

const superagent = require('superagent');

module.exports = getLocation;

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

// Server Error , Any Error
function errorHandler(error,request,response) {
  response.status(500).send(error);
}
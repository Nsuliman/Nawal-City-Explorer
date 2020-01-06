'use strict';

const superagent = require('superagent');

module.exports = getTrail;

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
  
// Server Error , Any Error
function errorHandler(error,request,response) {
  response.status(500).send(error);
}
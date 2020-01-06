'use strict';

const superagent = require('superagent');

module.exports = getYelp;

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
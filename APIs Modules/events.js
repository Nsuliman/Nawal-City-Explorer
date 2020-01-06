'use strict';

const superagent = require('superagent');

module.exports = getEvent;

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

// Server Error , Any Error
function errorHandler(error,request,response) {
  response.status(500).send(error);
}
'use strict';

/***************************************** The Basic *****************************************/
require('dotenv').config();

const express = require('express');

const cors = require('cors');

const PORT = process.env.PORT || 3000 ;

const server = express();

server.use(cors());

/********************************************* Ruotes  *********************************************/

// test the sever is works , yes it does :) 
server.get('/' , (req,res) =>
{
    res.status(200).send('The Root/Home Ruote , It\'s Works ');
});

/********************************* The Location *************************************/
// Location 

server.get('/location' , (req,res) =>
{
    // res.send('Location Ruote ');

    const locationData = require('./data/geo.json');
    console.log('locationData : ', locationData);
    const location = new Location(locationData);
    console.log('location : ', location);
    res.status(200).json(location);

}); // end of loaction ruote 

// Location Constructor Function 
function Location( data ) {
    this.search_query = 'lynnwood';
    this.formatted_query = data.results[0].formatted_address;
    this.latitude = data.results[0].geometry.location.lat;
    this.longitude = data.results[0].geometry.location.lng;
  } // end of con.fun of Location 

/********************************* The Weather *************************************/
// Weather 

server.get('/weather' , (req,res) =>
{
    // res.send('Weather Ruote ');

}); // end of weather ruote 

/***************************************** Errors Handlers *****************************************/

// User Error 
server.use('*' , (req,res) =>
{
    res.status(404).send('Not Found');
});

// Server Error , Any Error
server.use((error,req,res) =>
{
    res.status(500).send(error);
});

server.listen(PORT , () => console.log(`I am a live , Server Listening on port ${PORT}`));

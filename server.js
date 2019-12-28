'use strict';

/***************************************** The Basic *****************************************/
require('dotenv').config();

const express = require('express');

const cors = require('cors');

const PORT = process.env.PORT || 3000 ;

const server = express();

server.use(cors());

/********************************************* Ruotes  *********************************************/

server.get('/' , (req,res) =>
{
    res.status(200).send('The Root/Home Ruote , It\'s Works');
});

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

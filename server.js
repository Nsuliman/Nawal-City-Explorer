'use strict';

require('dotenv').config();

const express = require('express');

const pg = require('pg');

const server = express();

const PORT = process.env.PORT || 3000 ;

const cors = require('cors');

server.use(cors());






server.listen(PORT , () => console.log(`I am a live , Server Listening on port ${PORT}`));

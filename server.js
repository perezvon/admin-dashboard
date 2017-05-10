'use strict';

require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const path = require('path');

const helpers = require('./globalHelpers.js')

const app = express()

const port = process.env.PORT || 3001;

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, '..', 'build')));
}

//support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));

// Always return the main index.html, so react-router render the route in the client
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

app.get('/api/customergroup', (req, res) => {
  var options = {
  "method": "GET",
  "hostname": "apirest.3dcart.com",
  "port": null,
  "path": "/3dCartWebAPI/v1/CustomerGroups/1/Customers?limit=300",
  "headers": {
    "accept": "application/json",
    "content-type": "application/json;charset=UTF-8",
    "secureurl": "https://aspenmills-com.3dcartstores.com",
    "token": process.env.REACT_APP_TOKEN,
    "privatekey": process.env.REACT_APP_KEY,
    "cache-control": "no-cache"
  }
};
  helpers.getAPIData(options, data => {
    console.log(data)
    res.send(data);
  	res.end();
  })
})

app.get('/api/orders', (req, res) => {
  var options = {
  "method": "GET",
  "hostname": "apirest.3dcart.com",
  "port": null,
  "path": "/3dCartWebAPI/v1/Orders?limit=300",
  "headers": {
    "accept": "application/json",
    "content-type": "application/json;charset=UTF-8",
    "secureurl": "https://aspenmills-com.3dcartstores.com",
    "token": process.env.REACT_APP_TOKEN,
    "privatekey": process.env.REACT_APP_KEY,
    "cache-control": "no-cache"
  }
};
  helpers.getAPIData(options, data => {
    res.send(data);
  	res.end();
  })
})

app.listen(port, function() {
    console.log('App listening on port ' + port);
});

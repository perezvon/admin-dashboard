'use strict';

require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const path = require('path');

const helpers = require('./globalHelpers.js')

const app = express()

const port = process.env.PORT || 3001;

//support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.resolve(__dirname, 'build')));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

app.get('/api/customergroup/:id', (req, res) => {
  const url = helpers.getURL(req.params.id);
  console.log(url);
  var options = {
  "method": "GET",
  "hostname": "apirest.3dcart.com",
  "port": null,
  "path": "/3dCartWebAPI/v1/CustomerGroups/" + req.params.id + "/Customers?limit=300",
  "headers": {
    "accept": "application/json",
    "content-type": "application/json;charset=UTF-8",
    "secureurl": url,
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

app.get('/api/orders/:id', (req, res) => {
  console.log(req.params.id)
  const url = helpers.getURL(req.params.id);
  var options = {
  "method": "GET",
  "hostname": "apirest.3dcart.com",
  "port": null,
  "path": "/3dCartWebAPI/v1/Orders?limit=300",
  "headers": {
    "accept": "application/json",
    "content-type": "application/json;charset=UTF-8",
    "secureurl": url,
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

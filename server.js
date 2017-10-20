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

app.post('/api', (req, res) => {
	const orderData = req.body[0] ? req.body[0] : req.body;
	//check for supervisor function not currently needed; using static env variable QM_EMAIL to send approve/deny
	//helpers.checkForSupervisor(orderData.CustomerID, adminEmail => {
		helpers.approvalNeeded(process.env.QM_EMAIL, orderData);
	//});
	res.end('yes');
})

app.get('/api/customers/:id', (req, res) => {
  const url = process.env.API_URL;
  var options = {
  "method": "GET",
  "hostname": "apirest.3dcart.com",
  "port": null,
  "path": "/3dCartWebAPI/v1/Customers?limit=300",
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

app.get('/api/orders/', (req, res) => {
  const url = process.env.API_URL;
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

app.get('/api/approve', (req, res) => {
	const approved = req.query.result;
	const orderID = req.query.OrderID;
	if (approved === 'true') {
		helpers.updateOrderStatus(orderID, 8)
		res.send('request approved!')
	} else {
		//helpers.updateOrderStatus(orderID, 9)
		res.sendFile(path.join(__dirname + '/deny.html'));
		//helpers.sendEmail(address, 'denied')
	}
})

app.post('/api/approve', (req, res) => {
	const comment = req.body.comment
	const address = req.body.email
	const OrderID = req.body.orderID
	const orderNumber = req.body.orderNumber
	helpers.getOrderInfo(OrderID, order => {
		order.comment = comment
		const options = {
			from: '"Aspen Mills" <orders@aspenmills.com>',
			to: address, // list of receivers
			subject: 'Order Denied - Order #' + orderNumber
		}
			helpers.updateOrderStatus(OrderID, 9)
			helpers.sendEmail(address, options, order, 'denied')
			res.send('request denied.')
	})

})

app.listen(port, function() {
    console.log('App listening on port ' + port);
});

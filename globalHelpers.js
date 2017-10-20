
function sendEmail(address, options, data, template) {
  const EmailTemplate = require('email-templates').EmailTemplate
  const path = require('path')

  const templateDir = path.join(__dirname, 'templates', template)

  const htmlTemplate = new EmailTemplate(templateDir);

  const nodemailer = require('nodemailer');

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'mailgun',
 auth: {
     user: process.env.MAIL_USER,
     pass: process.env.MAIL_PASS
 }
  });

  htmlTemplate.render(data, function (err, result) {
    let mailOptions = options
    mailOptions.text = result.text
    mailOptions.html = result.html

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
    });

  })
}

function getOrderInfo(orderID, callback) {
  const http = require("https");
  const options = {
    "method": "GET",
    "hostname": "apirest.3dcart.com",
    "port": null,
    "path": "/3dCartWebAPI/v1/Orders/" + orderID,
    "headers": {
      "accept": "application/json",
      "content-type": "application/json;charset=UTF-8",
      "secureurl": process.env.API_URL,
      "token": process.env.REACT_APP_TOKEN,
      "privatekey": process.env.REACT_APP_KEY,
      "cache-control": "no-cache",
    }
  };

  const req = http.request(options, function (res) {
      var chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function () {
        const body = Buffer.concat(chunks);
        if (body && !!body.toString()) {
        const order = JSON.parse(body.toString())[0];
        return callback(order);
        }
      });
    });
  req.end();
}

//currently deprecated, sending with env var QM_EMAIL instead. We'd use this if there were more than one supervisor/QM for a group.
function checkForSupervisor(customerID, callback) {
  const http = require("https");
  const options = {
    "method": "GET",
    "hostname": "apirest.3dcart.com",
    "port": null,
    "path": "/3dCartWebAPI/v1/Customers/" + customerID,
    "headers": {
      "accept": "application/json",
      "content-type": "application/json;charset=UTF-8",
      "secureurl": process.env.API_URL,
      "token": process.env.REACT_APP_TOKEN,
      "privatekey": process.env.REACT_APP_KEY,
      "cache-control": "no-cache"
    }
  };

  const req = http.request(options, function (res) {
  let chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
      var body = Buffer.concat(chunks);
      if (body && !!body.toString()) {
        const user = JSON.parse(body.toString())[0];
        return callback(user.AdditionalField1);
      }
  });
});

req.end();
}

function approvalNeeded(address, orderInfo) {
  //update order status to Awaiting Approval / On Hold
  updateOrderStatus(orderInfo.OrderID, 6);
  //send approval email
  const options = {
    from: '"Aspen Mills" <orders@aspenmills.com>',
    to: address, // list of receivers
    subject: 'Approval Needed - Order #' + orderInfo.InvoiceNumberPrefix + orderInfo.InvoiceNumber
  }
	if (address) sendEmail(address, options, orderInfo, 'approval')
  else return false;
}

function updateOrderStatus(orderID, status, callback) {
  const http = require("https");
  const options = {
    "method": "PUT",
    "hostname": "apirest.3dcart.com",
    "port": null,
    "path": "/3dCartWebAPI/v1/Orders/" + orderID,
    "headers": {
      "accept": "application/json",
      "content-type": "application/json;charset=UTF-8",
      "secureurl": process.env.API_URL,
      "token": process.env.REACT_APP_TOKEN,
      "privatekey": process.env.REACT_APP_KEY,
      "cache-control": "no-cache",
    }
  };

  const req = http.request(options, function (res) {
      var chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function () {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
      });
    });

  req.write(JSON.stringify({ OrderStatusID: status }));
  req.end();
}

function getAPIData (options, callback) {

  const http = require("https");

  const req = http.request(options, function (res) {
    let chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function () {
      let body = Buffer.concat(chunks);
      return callback(body.toString());
    });
  });

  req.end();
}

module.exports = {checkForSupervisor, approvalNeeded, updateOrderStatus, sendEmail, getOrderInfo, getAPIData};

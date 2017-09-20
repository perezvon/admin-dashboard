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

module.exports = {getAPIData, getURL};

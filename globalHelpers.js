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

function getURL (id) {
  switch(+id){
    case 1:
      return 'mhfduniforms-com.3dcartstores.com';
      break;
    case 2:
      return 'http://717826996775.3dcart.net/';
      break;
    default:
      return 'https://aspenmills-com.3dcartstores.com';
  }
}

module.exports = {getAPIData, getURL};

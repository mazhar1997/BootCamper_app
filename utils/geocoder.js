const dotenv = require("dotenv");
dotenv.config()
const NodeGeocoder = require('node-geocoder');

const options = {
  provider:process.env.GEOCODER_PROVIDER,
  httpAdapter: 'https',
  apiKey:process.env.GEO_API_KEY,
  formatter: null
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
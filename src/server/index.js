const dotenv = require('dotenv');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const cors = require('cors');
const mockAPIResponse = require('./mockAPI.js');

dotenv.config();

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('dist'));

const allTravels = []

app.get('/', function (req, res) {
  // for the production build
  res.sendFile('dist/index.html');

  // for the development build
  // res.sendFile(path.resolve('src/client/views/index.html'));
})

function saveTravel(travelData) {
  // TODO add some logic to same the data of on file
  console.log('||| in saveTravel function')
  console.log('||| data: ', travelData)

  console.log(typeof allTravels)
  allTravels.push(travelData)
  console.log('||| all travel: ', allTravels)

}

app.post('/add-travel', async (req, res) => {
  const {travelInfo} = req.body;
  console.log(travelInfo.travelCity)
  await handleWeatherbitApi(travelInfo.travelCity, travelInfo.travelDuration)
      .then(function (weatherbiteResponse){
        handleGeoNameApi(weatherbiteResponse)
            .then(function (geoNameResponse){
              handlePixabayApi(geoNameResponse)
            })
            // .then(function (pixabayResponse){
            //   saveTravel(pixabayResponse);
        // })
      })

});
// call the Weatherbit API input[durationDate, city, key] output[weatherDescription, lat, lon]
const handleWeatherbitApi = async (city, duration) => {
  console.log('||| in handleWeatherbitApi function')
  console.log('||| data: ' + city + ' ** '+ duration)

  const WEATHERBIT_API_BASE_URL = 'https://api.weatherbit.io/v2.0/forecast/daily'
  const WEATHERBIT_API_KEY = process.env.WEATHERBIT_API_KEY
  const weatherbitApiUrl = WEATHERBIT_API_BASE_URL + '?city=' + city + '&days=' + duration +
      '&key=' + WEATHERBIT_API_KEY;

  console.log(weatherbitApiUrl);
  const response = await fetch(weatherbitApiUrl);
  console.log('||| weatherbitApi AFTER FETCH')
  try {
    const APIData = await response.json();
    const apiResponseData = {
      description: APIData.data[0].weather.description,
      lat: APIData.lat,
      lon: APIData.lon,
      city: city,
    }
    return apiResponseData;
  }catch (e) {
    console.log('Error in WeatherbitApi: ' + e);
  }
}

// call GeoName API input[lat, lon, key] output[countryName]         {{.then}}
const handleGeoNameApi = async (data) => {
  console.log('||| in handleGeoNameApi function')
  console.log('||| data: ', data)

  const GEONAME_API_BASE_URL = 'http://api.geonames.org/countryCode'
  const GEONAME_API_KEY = process.env.GEONAME_API_KEY
  const geoNameApiUrl = GEONAME_API_BASE_URL + '?lat=' + data.lat + '&lng=' + data.lon +
      '&username=' + GEONAME_API_KEY + '&type=JSON';
  console.log(geoNameApiUrl);
  const response = await fetch(geoNameApiUrl)
  console.log('||| geoNameApi AFTER FETCH')

  try{
    const APIData = await response.json();
    const apiResponseData = {
      'country': APIData.countryName,
      'city': data.city,
      'description': data.description,
    }
    return apiResponseData;
  }catch (e) {
    console.log('Error in GeoNameApi: ' + e);
  }
}

// call PixaBay API input[countryName, city, key] output[2x images]  {{.then}}
const handlePixabayApi = async (data) => {
  console.log('||| in handlePixabayApi function')
  console.log('||| data: ', data)

  const PIXABAY_API_BASE_URL = 'https://pixabay.com/api/'
  const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;
  const pixabayApiUrlCountry = PIXABAY_API_BASE_URL + '?q=country+flag+' + data.country + '&key=' + PIXABAY_API_KEY;
  const pixabayApiUrlCity = PIXABAY_API_BASE_URL + '?category=places&q=' + data.city + '&key=' + PIXABAY_API_KEY;

  console.log(pixabayApiUrlCountry);
  const countryResponse = await fetch(pixabayApiUrlCountry)
  console.log('||| pixabayApiCountry AFTER FETCH')

  console.log(pixabayApiUrlCity);
  const cityResponse = await fetch(pixabayApiUrlCity)
  console.log('||| pixabayApiCity AFTER FETCH')


  try {
    const APICountryData = await countryResponse.json();
    const APICityData = await cityResponse.json();
    const apiResponseData = {
      'countryImg': APICountryData.hits[0].webformatURL,
      'cityImg': APICityData.hits[0].webformatURL,
      'country': data.country,
      'city': data.city,
      'description': data.description,
    }
    console.log('||| final data: ', apiResponseData)
    saveTravel(apiResponseData)
    return apiResponseData;
  }catch (e) {
    console.log('Error in PixabayApi: ' + e);
  }
};

app.get('/test', function (req, res) {
  res.send(mockAPIResponse);
})

// what port the app will listen to for incoming requests
app.listen(8081, (error) => {
  if (error) throw new Error(error);
  console.log('Server listening on port 8081!');
})

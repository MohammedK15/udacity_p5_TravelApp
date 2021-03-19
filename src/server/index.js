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
  console.log('||| in saveTravel function')
  console.log('||| data to save: ', travelData)

  allTravels.push(travelData)

  console.log('||| all travel: ', allTravels)
}

app.get('/get-travels',  (req, res) => {
  console.log('||| GET request get travels')
  res.json(
      {
        status: 'success',
        data: allTravels,
        message: 'retrieved data',
      }
  )
});

app.post('/add-travel', async (req, res) => {
  const {travelInfo} = req.body;
  console.log(travelInfo.travelCity)
  await handleWeatherbitApi(travelInfo.travelCity, travelInfo.daysToStartTravel, travelInfo.travelStart,
      travelInfo.travelEnd)
      .then(async function (weatherbiteResponse){
        await handleGeoNameApi(weatherbiteResponse)
            .then(async function (geoNameResponse){
              await handlePixabayApi(geoNameResponse)
            })

        console.log('#############################')
            // .then(function (pixabayResponse){
            //   saveTravel(pixabayResponse);
        // })
      })
  console.log('||| return to client side')
  res.send({'msg': 'saved'})
});
// call the Weatherbit API input[Date, city, key] output[weatherDescription, lat, lon]
const handleWeatherbitApi = async (city, daysToStart, startDate, endDate) => {
  console.log('||| in handleWeatherbitApi function')
  console.log('||| data: ' + city + ' ** '+ daysToStart)

  const WEATHERBIT_API_BASE_URL = 'https://api.weatherbit.io/v2.0/'
  const WEATHERBIT_API_KEY = process.env.WEATHERBIT_API_KEY
  let weatherbitApiUrl = '';

  // to check if the the trip within a week or not
  if(daysToStart >= 7){
    weatherbitApiUrl = WEATHERBIT_API_BASE_URL + 'forecast/daily' + '?city=' + city
        + '&start_date=' + startDate + '&end_date=' + endDate + '&key=' + WEATHERBIT_API_KEY;
  }else {
    weatherbitApiUrl = WEATHERBIT_API_BASE_URL + 'current' + '?city=' + city + '&key=' + WEATHERBIT_API_KEY;
  }

  console.log(weatherbitApiUrl);
  const response = await fetch(weatherbitApiUrl);
  console.log('||| weatherbitApi AFTER FETCH')
  try {
    const APIData = await response.json();
    let lat = '';
    let lon = '';
    if (daysToStart >= 7){
      lat = APIData.lat;
      lon = APIData.lon;
    }else{
      lat = APIData.data[0].lat;
      lon = APIData.data[0].lon;
    }

    console.log('||| END handleWeatherbitApi function')

    return {
      'description': APIData.data[0].weather.description,
      'lat': lat,
      'lon': lon,
      'city': city,
      'startDate': startDate,
      'endDate': endDate,
    };
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

    console.log('||| END handleGeoNameApi function')

    return {
      'country': APIData.countryName,
      'city': data.city,
      'description': data.description,
      'startDate': data.startDate,
      'endDate': data.endDate,
    };
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
      'startDate': data.startDate,
      'endDate': data.endDate,
    }
    console.log('||| final data: ', apiResponseData)
    saveTravel(apiResponseData)

    console.log('||| END handlePixabayApi function')

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

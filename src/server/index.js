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
app.use(bodyParser.json());
app.use(express.static('dist'));

const BASE_URL = 'https://api.meaningcloud.com/sentiment-2.1';
const API_KEY = process.env.meaning_cloud_API_KEY;

app.get('/', function (req, res) {
  // for the production build
  res.sendFile('dist/index.html');

  // for the development build
  // res.sendFile(path.resolve('src/client/views/index.html'));
})

app.post('/add-url', async (req, res) => {
  const {articleUrl} = req.body;
  const meaningCloudApiUrl = BASE_URL + '?key=' + API_KEY + '&url=' + articleUrl + '&lang=en';
  const response = await fetch(meaningCloudApiUrl);
  try {
    const data = await response.json();
    const apiResponseData = {
      score_tag: data.score_tag,
      agreement: data.agreement,
      subjectivity: data.subjectivity,
      confidence: data.confidence,
      irony: data.irony,
    }
    console.log('send data to front-end');
    res.send(apiResponseData);
    console.log('finish sending data ' + apiResponseData);
  }catch (e) {
    console.log('Error ' + e);
  }
});

app.get('/test', function (req, res) {
  res.send(mockAPIResponse);
})

// what port the app will listen to for incoming requests
app.listen(8081, (error) => {
  if (error) throw new Error(error);
  console.log('Server listening on port 8081!');
})

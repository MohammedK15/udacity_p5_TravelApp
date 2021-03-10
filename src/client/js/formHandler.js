import isURLValid from "./validateURL";
import isDateValid from "./validateDate";
import moment from "moment";

const postData = async (url = '', data = {}) => {
  const res = await fetch(url, {
    method: 'POST',
    credentials: "same-origin",
    mode: "cors",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  });
  try {
    return await res.json();
  } catch (e) {
    console.log('Error: ' + e);
  }
}

const handleSubmit = async () => {
  /**
   * Get Value of the input for URL
   * Check if it's URL or not
   *  yes
   *      send it to the backend
   *  no
   *      show user message it's not valid URL
   */
  console.log('||| in handleSubmit function')

  try {
    // get values from UI
    const travelCity = document.getElementById('travelCityInput').value;
    const travelStartDate = document.getElementById('start-date-input').value;
    const travelEndDate = document.getElementById('end-date-input').value;

    if (isDateValid(travelStartDate, travelEndDate)) {
      // get the duration from MomentJS
      const momentStartDate = moment(travelStartDate);
      const momentEndDate = moment(travelEndDate);
      const durationDays = moment.duration(momentEndDate.diff(momentStartDate)).asDays();
      const travelInfo = {
        'travelCity': travelCity,
        'travelDuration': durationDays,
      }
      console.log('||| before postData server side - data passed: ' + travelInfo['travelCity'] + ' ** ' + travelInfo['travelDuration'])

      const data = await postData('http://localhost:8081/add-travel', {travelInfo});
      console.log(data)
    }
    // todo add some message if the dates are note valid below or in "isDateValid" function

    // const articleUrl = document.getElementById('url_article').value;
    // if (isURLValid(articleUrl)) {
    //   // port 8081 is for the server
    //   const data = await postData('http://localhost:8081/add-url', {articleUrl});
    //   console.log(data)
    //
    //   //update the UI
    //   document.getElementById('score_tag').textContent = 'Score Tag: ' + data.score_tag;
    //   document.getElementById('agreement').textContent = 'Agreement: ' + data.agreement;
    //   document.getElementById('subjectivity').textContent = 'Subjectivity: ' + data.subjectivity;
    //   document.getElementById('confidence').textContent = 'Confidence: ' + data.confidence;
    //   document.getElementById('irony').textContent = 'Irony: ' + data.irony;
    //
    // } else {
    //   alert('please enter a valid URL');
    // }
  }catch (e) {
    console.log(e)

  }
}

export default handleSubmit;

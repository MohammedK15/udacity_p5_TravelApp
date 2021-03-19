import isDateValid from './validateDate'
import moment from 'moment'
import updateUI from './updateUserInterface'

const postData = async (url = '', data = {}) => {
  const res = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  try {
    return await res.json()
  } catch (e) {
    console.log('Error: ' + e)
  }
}

const handleSubmit = async () => {
  console.log('||| in handleSubmit function')
  try {
    // get values from UI
    const travelCity = document.getElementById('travelCityInput').value
    const travelStartDate = document.getElementById('start-date-input').value
    const travelEndDate = document.getElementById('end-date-input').value

    if (isDateValid(travelStartDate, travelEndDate)) {
      // get the duration from MomentJS
      const momentStartDate = moment(travelStartDate)
      const momentNow = moment()
      const daysToStart = momentStartDate.diff(momentNow, 'days') + 1

      const travelInfo = {
        travelCity: travelCity,
        daysToStartTravel: daysToStart,
        travelStart: travelStartDate,
        travelEnd: travelEndDate,
      }
      console.log(
        '||| before postData server side - data passed: ' +
          travelInfo['travelCity'] +
          ' ** ' +
          travelInfo['daysToStartTravel']
      )

      const data = await postData('http://localhost:8081/add-travel', { travelInfo })
      console.log(data)
      Toastify({
        text: 'Travel Saved Currently',
        duration: 3000,
        close: true,
        gravity: 'top', // `top` or `bottom`
        position: 'center', // `left`, `center` or `right`
        backgroundColor: 'linear-gradient(to right, #c2edce, #badfe7)',
        className: 'toastify__font-style',
        stopOnFocus: true, // Prevents dismissing of toast on hover
      }).showToast()

      await updateUI()
    }

  } catch (e) {
    console.log(e)
  }
}

export default handleSubmit

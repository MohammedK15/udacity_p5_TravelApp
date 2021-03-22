import moment from "moment";

const updateUI = async () => {
  const getTravel = await fetch('http://localhost:8081/get-travels')

  try {
    const travelsDataJSON = await getTravel.json()
    console.log(travelsDataJSON)

    const accordion = document.getElementById('accordion')
    // to clean if there any previous result to avoid duplication
    accordion.innerText = ''

    const fragment = document.createDocumentFragment()
    const travels = travelsDataJSON.data

    for (let i = 0; i < travels.length; i++) {
      // create the UI for each travel
      // travels contain ['countryImg', 'cityImg', 'country', 'city', 'description', 'startDate', 'endDate']
      const card = document.createElement('div')
      card.setAttribute('class', 'card')

      const heading = document.createElement('div')
      heading.setAttribute('class', 'card-header')
      // heading.setAttribute('class', 'align-items-center');
      heading.setAttribute('id', `heading${i + 1}`)
      card.appendChild(heading)

      const countryFlagImg = document.createElement('img')
      countryFlagImg.setAttribute('class', 'img-country__flag')
      countryFlagImg.setAttribute('src', travels[i].countryImg)
      countryFlagImg.setAttribute('alt', `${travels[i].country} Flag`)
      heading.appendChild(countryFlagImg)

      const countryCityNames = document.createElement('h5')
      countryCityNames.setAttribute('class', 'countryCity__Name')
      countryCityNames.innerText = `${travels[i].city}, ${travels[i].country}`
      heading.appendChild(countryCityNames)

      const button = document.createElement('button')
      button.setAttribute('class', 'btn btn-link')
      button.setAttribute('data-toggle', 'collapse')
      button.setAttribute('data-target', `#collapse${i + 1}`)
      button.setAttribute('aria-controls', `collapse${i + 1}`)
      button.innerText = 'Toggle'
      heading.appendChild(button)

      const collapseBody = document.createElement('div')
      collapseBody.setAttribute('id', `collapse${i + 1}`)
      collapseBody.setAttribute('class', 'collapse')
      collapseBody.setAttribute('aria-labelledby', `heading${i + 1}`)
      collapseBody.setAttribute('data-parent', '#accordion')
      card.appendChild(collapseBody)

      const cardBody = document.createElement('div')
      cardBody.setAttribute('class', 'card-body')
      cardBody.style.backgroundImage = `url(${travels[i].cityImg})`
      collapseBody.appendChild(cardBody)

      const bodyUL = document.createElement('ul')
      bodyUL.setAttribute('class', 'ul-body')
      cardBody.appendChild(bodyUL)

      const startDateLI = document.createElement('li')
      startDateLI.innerText = `Arrived Date: ${travels[i].startDate}`
      bodyUL.appendChild(startDateLI)

      const endDateLI = document.createElement('li')
      endDateLI.innerText = `Depart Date: ${travels[i].endDate}`
      bodyUL.appendChild(endDateLI)

      const lengthOfTrip = document.createElement('li')
      const momentStartDate = moment(travels[i].startDate)
      const momentEndDate = moment(travels[i].endDate)
      lengthOfTrip.innerText = `Trip long in Days: ${momentEndDate.diff(momentStartDate, 'days') + 1}`
      bodyUL.appendChild(lengthOfTrip)

      const description = document.createElement('li')
      description.innerText = `The Weather Forecast: ${travels[i].description}`
      bodyUL.appendChild(description)

      fragment.appendChild(card)
    }
    accordion.appendChild(fragment)
  } catch (e) {
    console.log('error: ', e)
  }
}

export default updateUI

import isDateValid from './js/validateDate';
import handleSubmit from './js/formHandler';

import './styles/style.scss';

// to wait until the page fully loaded
window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('travel_form');
  form.addEventListener('submit', (event) => {
    // to prevent reloading the page
    event.preventDefault();
    console.log('||| in addEventListener')
    handleSubmit();
  })
})
export { isDateValid, handleSubmit }

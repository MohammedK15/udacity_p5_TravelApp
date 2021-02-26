import isURLValid from './js/validateURL';
import handleSubmit from './js/formHandler';

import './styles/style.scss';

// to wait until the page fully loaded
window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form_article');
  form.addEventListener('submit', (event) => {
    // to prevent reloading the page
    event.preventDefault();
    handleSubmit();
  })
})
export { isURLValid, handleSubmit }

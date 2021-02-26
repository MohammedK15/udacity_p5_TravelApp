import isURLValid from "./validateURL";

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
  const articleUrl = document.getElementById('url_article').value;
  if (isURLValid(articleUrl)) {
    // port 8081 is for the server
    const data = await postData('http://localhost:8081/add-url', {articleUrl});
    console.log(data)

    //update the UI
    document.getElementById('score_tag').textContent = 'Score Tag: ' + data.score_tag;
    document.getElementById('agreement').textContent = 'Agreement: ' + data.agreement;
    document.getElementById('subjectivity').textContent = 'Subjectivity: ' + data.subjectivity;
    document.getElementById('confidence').textContent = 'Confidence: ' + data.confidence;
    document.getElementById('irony').textContent = 'Irony: ' + data.irony;

  } else {
    alert('please enter a valid URL');
  }
}

export default handleSubmit;

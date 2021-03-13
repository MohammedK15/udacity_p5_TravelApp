


const updateUI = async () => {
    const getTravel = await fetch('http://localhost:8081/get-travels');

    try {
        const travelsDataJSON = await getTravel.json();
        console.log(travelsDataJSON)

        const fragment = document.createDocumentFragment();
        const travels = travelsDataJSON.data;
        const accordion = document.getElementById('accordion');

        for (let i = 0 ; i < travels.length ; i++){
            // create the UI for each travel
            const card = document.createElement('div');
            card.setAttribute('class', 'card');

            const heading = document.createElement('div');
            heading.setAttribute('class', 'card-header');
            heading.setAttribute('id', `heading${i+1}`);
            card.appendChild(heading);

            const h5 = document.createElement('h5');
            h5.setAttribute('class', 'mb-0');
            heading.appendChild(h5);

            const button = document.createElement('button');
            button.setAttribute('class', 'btn btn-link');
            button.setAttribute('data-toggle', 'collapse');
            button.setAttribute('data-target', `#collapse${i+1}`);
            // button.setAttribute('aria-expanded', 'true');
            button.setAttribute('aria-controls', `collapse${i+1}`);
            button.innerText = travels[i].city;
            h5.appendChild(button);

            const collapseBody = document.createElement('div');
            collapseBody.setAttribute('id',`collapse${i+1}`);
            collapseBody.setAttribute('class','collapse');
            collapseBody.setAttribute('aria-labelledby',`heading${i+1}`);
            collapseBody.setAttribute('data-parent','#accordion');
            card.appendChild(collapseBody);

            const cardBody = document.createElement('div');
            cardBody.setAttribute('class', 'card-body');
            collapseBody.appendChild(cardBody);

            fragment.appendChild(card);
        }
        accordion.appendChild(fragment)
    } catch (e) {
        console.log('error: ', e)
    }

}

export default updateUI;
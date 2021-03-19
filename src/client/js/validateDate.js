import moment from "moment";

const isDateValid = (startDate, endDate) => {
    const now = moment()
    const momentStartDate = moment(startDate);
    const momentEndDate = moment(endDate);

    if(momentStartDate > momentEndDate){
        console.log('can not be the end before start')
        Toastify({
            text: "Please enter a valid date. Can not be the end before start.",
            duration: 3000,
            // destination: "https://github.com/apvarun/toastify-js",
            // newWindow: true,
            close: true,
            gravity: "bottom", // `top` or `bottom`
            position: 'center', // `left`, `center` or `right`
            backgroundColor: "linear-gradient(to right, #ff6c6f, #badfe7)",
            className: 'toastify__font-style',
            stopOnFocus: true, // Prevents dismissing of toast on hover
            // onClick: function(){} // Callback after click
        }).showToast();
        return false
    }else if(momentStartDate < now){
        console.log('can not start in the past')
        Toastify({
            text: "Please enter a valid date. Can not start travel in the past.",
            duration: 3000,
            close: true,
            gravity: "bottom", // `top` or `bottom`
            position: 'center', // `left`, `center` or `right`
            backgroundColor: "linear-gradient(to right, #ff6c6f, #9abfb7)",
            className: 'toastify__font-style',
            stopOnFocus: true, // Prevents dismissing of toast on hover
        }).showToast();
        return false
    }else if(momentStartDate == momentEndDate){
        console.log('can not be the start and end in the same time')
        Toastify({
            text: "Please enter a valid date. Can not be the start date and end date in the same time.",
            duration: 3000,
            close: true,
            gravity: "bottom", // `top` or `bottom`
            position: 'center', // `left`, `center` or `right`
            backgroundColor: "linear-gradient(to right, #ff6c6f, #badfe7)",
            className: 'toastify__font-style',
            stopOnFocus: true, // Prevents dismissing of toast on hover
        }).showToast();
        return false
    }
    console.log(now)
    return true
}

export default isDateValid;

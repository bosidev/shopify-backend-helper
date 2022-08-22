let isNewRefund = true;

const intervalFunctionRestock = setInterval(() => {

    let isCorrectUrl = (window.location.pathname.split('/')[window.location.pathname.split('/').length -1] === 'refund') ? true : false;
    
    if (isCorrectUrl) {
        giveButtonsClickEvent();
    } else {
        return isNewRefund = true;
    };  

}, 1000);

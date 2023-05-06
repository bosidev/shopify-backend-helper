let myshopifyDomain = window.location.host
let companyApiBase = 'https://' + myshopifyDomain + '/admin/api/2022-04';
let orderResourceSuffix = '/orders/';
let variantResourceSuffix = '/variants/';
let fileSuffix = '.json';

const intervalFunction = setInterval(() => {
    
    let isCorrectUrl = (window.location.pathname.split('/')[2] === "orders" && window.location.pathname.split('/').length === 4) ? true : false;

    if (isCorrectUrl) {
        displayInventoryData();
    } else {
        return;
    }
    
},2000);

let myshopifyDomain, companyApiBase;

if (window.location.host.includes("admin.shopify.com")) {
  myshopifyDomain = window.location.pathname.split("/")[2];
  companyApiBase = "https://admin.shopify.com/store/" + myshopifyDomain + "/admin/api/2023-07";
} else {
  myshopifyDomain = window.location.host;
  companyApiBase = "https://" + myshopifyDomain + "/admin/api/2023-07";
}

let orderResourceSuffix = "/orders/";
let variantResourceSuffix = "/variants/";
let productResourceSuffix = "/products/";
let fileSuffix = ".json";

const intervalFunction = setInterval(() => {
  let isCorrectUrl =
    window.location.pathname.includes("/orders/") &&
    window.location.pathname.split("/").length === 5
      ? true
      : false;
  if (isCorrectUrl) {
    displayInventoryData();
  } else {
    return;
  }
}, 2000);

let myshopifyDomain, companyApiBase;

if (window.location.host.includes("admin.shopify.com")) {
  myshopifyDomain = window.location.pathname.split("/")[2];
  companyApiBase =
    "https://admin.shopify.com/store/" + myshopifyDomain + "/admin/api/2024-07";
} else {
  myshopifyDomain = window.location.host;
  companyApiBase = "https://" + myshopifyDomain + "/admin/api/2024-07";
}

const orderResourceSuffix = "/orders/";
const variantResourceSuffix = "/variants/";
const productResourceSuffix = "/products/";
const metafieldResourceSuffix = '/metafields';
const fileSuffix = ".json";
const isCorrectUrl =
  window.location.pathname.includes("/orders/") &&
  window.location.pathname.split("/").length === 5
    ? true
    : false;

function containsArtikelnummer(node) {
  if (
    node.nodeType === Node.TEXT_NODE &&
    node.textContent.includes("Artikelnummer")
  ) {
    return true;
  }
  if (node.nodeType === Node.ELEMENT_NODE) {
    for (let child of node.childNodes) {
      if (containsArtikelnummer(child)) {
        return true;
      }
    }
  }
  return false;
}

if (isCorrectUrl) {
  const observer = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          if (containsArtikelnummer(node)) {
            observer.disconnect();
            displayInventoryData();
          }
        });
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

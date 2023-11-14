async function displayInventoryData() {
  const orderData = await fetchOrderData();
  const productsInOrder = orderData.order.line_items;
  const locationIdToExclude = 60759965893;
  let productSKUs = [];
  let productQuantities = [];

  for (let i = 0; i < productsInOrder.length; i++) {
    let variantId = await productsInOrder[i].variant_id;
    let response = await fetch(
      companyApiBase + variantResourceSuffix + variantId + fileSuffix
    );
    let data = await response.json();
    let isSpecial = false;
    const metaResponse = await fetch(
      companyApiBase +
        variantResourceSuffix +
        variantId +
        "/metafields" +
        fileSuffix
    );
    const metaData = await metaResponse.json();
    const metafieldSpecial = metaData.metafields.find(
      (metafield) => metafield.key === "should_sell_out"
    );
    if (metafieldSpecial) {
      isSpecial = metafieldSpecial.value === true ? true : false;
    }

    // Fetch the inventory level for this variant at "Snocks Coffee Mannheim"
    let inventoryResponse = await fetch(`${companyApiBase}/inventory_levels.json?inventory_item_ids=${data.variant.inventory_item_id}&location_ids=${locationIdToExclude}`);
    let inventoryData = await inventoryResponse.json();
    let excludeLocationInventory = inventoryData.inventory_levels.find(level => level.location_id === locationIdToExclude);

    let inventoryQuantity = data.variant.inventory_quantity - (excludeLocationInventory ? excludeLocationInventory.available : 0);
    let sku = data.variant.sku;
    let isAlreadyCreated = document.getElementById("OOS-" + i);

    productSKUs.push(sku);
    productQuantities.push(inventoryQuantity);

    if (!isAlreadyCreated) {
      setTimeout(() => {
        addElement(i);
      }, 1500);
    }

    setTimeout(() => {
      setElementContent(i, productSKUs, productQuantities, isSpecial);
    }, 1500);
  }
}

async function fetchOrderData() {
  let orderId =
    window.location.pathname.split("/")[
      window.location.pathname.split("/").length - 1
    ];
  let apiString = companyApiBase + orderResourceSuffix + orderId + fileSuffix;
  let response = await fetch(apiString);
  let orderData = await response.json();

  return orderData;
}

function addElement(i) {
  let newDiv = document.createElement("div");
  let newSpan = document.createElement("span");
  const allSpans = Array.from(document.querySelectorAll('span'));
  const artikelNummerElements = allSpans.filter((spanElement) => {
    return spanElement.textContent.includes('Artikelnummer')
  })
  
  let currentDiv = artikelNummerElements[i].parentElement;

  newDiv.setAttribute("id", "OOS-" + i);
  newSpan.setAttribute("id", "OOS-" + i + "-Span");

  newDiv.style.borderColor = "white";
  newDiv.style.borderStyle = "solid";
  newDiv.style.borderRadius = "10px";
  newDiv.style.textAlign = "center";
  newDiv.style.width = "200px";

  newDiv.appendChild(newSpan);

  if (currentDiv) {
    currentDiv.appendChild(newDiv);
  }
}

function setElementContent(i, productSKUs, productQuantities, isSpecial) {
  const allSpans = Array.from(document.querySelectorAll('span'));
  const artikelNummerElements = allSpans.filter((spanElement) => {
    return spanElement.textContent.includes('Artikelnummer')
  })
  
  let currentDiv = artikelNummerElements[i].parentElement;
  let childsOfCurrentDiv = currentDiv.getElementsByTagName("span");
  let currentProductSKU = "";
  const specialAddition = isSpecial ? "⭐ Special ⭐" : "";

  for (let j = 0; j < childsOfCurrentDiv.length; j++) {
    if (childsOfCurrentDiv[j].innerHTML.includes("Artikelnummer")) {
      currentProductSKU = childsOfCurrentDiv[j].innerHTML.replace(
        "Artikelnummer: ",
        ""
      );
    }
    for (let k = 0; k < productSKUs.length; k++) {
      if (currentProductSKU === productSKUs[k]) {
        let currentInventoryQuantity = productQuantities[k];

        let spanContent = document.getElementById("OOS-" + i + "-Span");
        let newDiv = document.getElementById("OOS-" + i);

        if (spanContent) {
          spanContent.textContent =
            currentInventoryQuantity.toString() +
            " Verfügbar " +
            specialAddition;
        }

        if (newDiv) {
          giveCorrectDivColor(currentInventoryQuantity, newDiv);
        }
      }
    }
  }
}

function giveCorrectDivColor(currentInventoryQuantity, newDiv) {
  if (currentInventoryQuantity > 20) {
    newDiv.style.backgroundColor = "lightgreen";
  } else if (currentInventoryQuantity <= 20 && currentInventoryQuantity > 0) {
    newDiv.style.backgroundColor = "beige";
  } else {
    newDiv.style.backgroundColor = "lightpink";
  }
}

// Uncheck Restock

const giveButtonsClickEvent = () => {
  let arrowButtons = document.getElementsByClassName(
    "Polaris-TextField__Segment_xdd2a"
  );
  let evenButtonPosition = true;

  for (let i = 0; i < arrowButtons.length; i++) {
    if (evenButtonPosition) {
      arrowButtons[i].addEventListener("click", uncheckByClick);
      evenButtonPosition = false;
    } else {
      evenButtonPosition = true;
      continue;
    }
  }
};

const uncheckByClick = () => {
  let checkboxIsVisible = document.querySelector(
    ".Polaris-Choice__Descriptions_pp5ln"
  );

  if (!checkboxIsVisible && isNewRefund === true) {
    setTimeout(() => {
      let checkbox = document.getElementsByClassName(
        "Polaris-Choice__Control_1u8vs"
      )[0];
      checkbox.click();
      isNewRefund = false;
    }, 100);
  }
};

async function displayInventoryData() {
  const orderId =
    window.location.pathname.split("/")[
      window.location.pathname.split("/").length - 1
    ];
  const orderData = await fetchData(orderResourceSuffix + orderId);
  const productsInOrder = orderData.order.line_items;
  const locationIdToExclude = 60759965893;

  productsInOrder.forEach(async (product) => {
    const variantId = product.variant_id;
    const productId = product.product_id;
    const variantData = await fetchData(
      productResourceSuffix + productId + variantResourceSuffix + variantId
    );
    const metaData = await fetchData(
      productResourceSuffix + productId + metafieldResourceSuffix
    );
    const isSpecial = metaData.metafields.find(
      (metafield) => metafield.key === "is_limited_edition"
    )?.value
      ? true
      : false;
    const sku = variantData.variant.sku;

    const inventoryResponse = await fetch(
      `${companyApiBase}/inventory_levels.json?inventory_item_ids=${variantData.variant.inventory_item_id}&location_ids=${locationIdToExclude}`
    );
    const inventoryData = await inventoryResponse.json();
    const excludeLocationInventory = inventoryData.inventory_levels.find(
      (level) => level.location_id === locationIdToExclude
    );

    const inventoryQuantity =
      variantData.variant.inventory_quantity -
      (excludeLocationInventory ? excludeLocationInventory.available : 0);

    addElement(sku, inventoryQuantity, isSpecial);
  });
}

async function fetchData(resource) {
  const apiString = companyApiBase + resource + fileSuffix;
  const response = await fetch(apiString);

  return await response.json();
}

function addElement(sku, inventoryQuantity, isSpecial) {
  const newDiv = document.createElement("div");
  const allSpans = Array.from(document.querySelectorAll("span"));
  const currentDiv = allSpans.find((spanElement) => {
    return spanElement.textContent.includes("Artikelnummer: " + sku);
  }).parentElement;

  newDiv.style.borderColor = "white";
  newDiv.style.borderStyle = "solid";
  newDiv.style.borderRadius = "10px";
  newDiv.style.textAlign = "center";
  newDiv.style.width = "200px";

  setElementContent(newDiv, inventoryQuantity, isSpecial);

  if (currentDiv) {
    currentDiv.appendChild(newDiv);
  }
}

function setElementContent(newDiv, inventoryQuantity, isSpecial) {
  const specialAddition = isSpecial ? "⭐ Special ⭐" : "";
  newDiv.textContent =
    inventoryQuantity.toString() + " Verfügbar " + specialAddition;

  giveCorrectDivColor(inventoryQuantity, newDiv);
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

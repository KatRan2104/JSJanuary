
window.addEventListener("load", async (event) => {
    let allProducts = await getAllProducts();
    displayProducts(allProducts.data);
    const urlParams = new URLSearchParams(window.location.search);
    await viewProduct(urlParams.get('id'));
    await viewBasket();
});
// Not together with the above


// This part works - Fetching all products list
async function fetchProducts() {
    const url = "https://v2.api.noroff.dev/rainy-days";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();

        // Place info in local storage
        localStorage.setItem("products", JSON.stringify(json));
    } catch (error) {
        console.error(error.message);
    }

}

// Await for the products to be loaded to the local storage and then get them.
async function getAllProducts() {
    if (!localStorage.getItem("products")) {
        await fetchProducts();
    }
    const products = JSON.parse(localStorage.getItem("products"));
    return products;
}

// Gets product by specific IDs as given in the array.
async function getProductById(id) {
    const products = await getAllProducts();
    return products.data.find(product => product.id === id);
}

// Adds product by ID to basket in local storage
function addToBasket(productId) {
    let basket = JSON.parse(localStorage.getItem("basket")) || {};
    let isInBasket = basket.hasOwnProperty(productId);
    if (isInBasket) {
        basket[productId] += 1;
    }
    else {
        basket[productId] = 1;
    }
    localStorage.setItem("basket", JSON.stringify(basket));
}

// Removes product by ID from basket in local storage
function removeFromBasket(productId) {
    let basket = JSON.parse(localStorage.getItem("basket")) || {};
    let isInBasket = basket.hasOwnProperty(productId);
    if (isInBasket) {
        basket[productId] -= 1;
        if (basket[productId] <= 0) {
            delete basket[productId];
        }
    }
    localStorage.setItem("basket", JSON.stringify(basket));
}


// Display products on front page - Display products
function displayProducts(productsToDisplay) {
    let productList = document.getElementById("product-list");
    if (productList===null) {
        return;
    }
    productList.innerHTML = "";
    if (!productsToDisplay.length) {
        productList.innerHTML = "<p>No Products found</p>";
        return;
    }
    productsToDisplay.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.className = "product";
        productDiv.innerHTML = `
            <img src="${product.image.url}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>Price: $${product.price}</p>
            <button onclick="goToProductPage('${product.id}')">View Product</button>
        `;
        productList.appendChild(productDiv);
    });
}

function goToProductPage(productId) {
    window.location.href = "./product/index.html?id=" + productId;
}


// Bugg in button onclick="closeProductPage()" - not working as expected 09.10.2025. Logs as undefined one product. Need to make checkout page html too.
async function viewProduct(productId) {
    let product = await getProductById(productId);
    if (!product) {
        return;
    }
    const productPage =  document.createElement("div");
    productPage.className = "product-details";
    productPage.innerHTML = `
            <h2>${product.title}</h2>
            <img src="${product.image.url}" alt="${product.title}">
            <p>${product.description}</p>
            <p>Price: $${product.price}</p>
            <p>Sizes: ${product.sizes}, </p>
            <button onclick="addToBasket('${product.id}')">Add to Basket</button>
        `;
    document.body.appendChild(productPage);
}

//View basket/checkout page - and confirme checkout.
async function viewBasket () {
    let basket = JSON.parse(localStorage.getItem("basket")) || {};

    let productList = document.getElementById("checkout-display");
    if (productList===null) {
        return;
    }
    productList.innerHTML = "";
    if (isEmpty(basket)) {
        productList.innerHTML = "<p>No items in basket</p>";
        return;
    }

    let totalCost = 0; // starts the total cost variable.


    for (const [productId, numberOfItems] of Object.entries(basket)) {
        console.log(`${productId}: ${numberOfItems}`);
        if (productId == "undefined") {
            continue;
        }
        const product = await getProductById(productId);
        console.log(product);
        if (!product) {
            continue; // Skip if the product is not found
        }

        const productDiv = document.createElement("div");
        productDiv.className = "product";
        productDiv.innerHTML = `
            <img src="${product.image.url}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>Price: $${product.price}</p>
            <div class="quantity-controls">
                <button onclick="changeQuantity('${productId}', -1)">-</button>
                <span id="quantity-${productId}">${numberOfItems}</span>
                <button onclick="changeQuantity('${productId}', 1)">+</button>
            </div>
        `;
        productList.appendChild(productDiv);

        // Calculate total cost
        totalCost += product.price * numberOfItems;
    }

    const totalCostDiv = document.createElement("div");
    totalCostDiv.className = "total-cost";
    totalCostDiv.innerHTML = `<h3>Total Cost: $${totalCost.toFixed(2)}</h3>`;
    productList.appendChild(totalCostDiv);
}

// Change quantity of product in basket
function changeQuantity(productId, change) {
    let basket = JSON.parse(localStorage.getItem("basket")) || {};

    if (!basket[productId]) return; // Product not in basket

    basket[productId] += change;

    if (basket[productId] <= 0) {
        delete basket[productId]; // Remove product if quantity is 0
    }

    localStorage.setItem("basket", JSON.stringify(basket));
    viewBasket(); // Refresh the basket display
}

/* <button onclick="goToProductPage('${product.id}')">View Product</button> */

function isEmpty(obj) {
    for (const prop in obj) {
        if (Object.hasOwn(obj, prop)) {
            return false;
        }
    }

    return true;
}

/* <p>Added items: ${numberOfItems}</p> */

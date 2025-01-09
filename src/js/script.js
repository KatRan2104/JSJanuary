
window.addEventListener("load", async (event) => {
    let allProducts = await getAllProducts();
    displayProducts(allProducts.data);
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
        console.log(json);

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
    return products.find(product => product.id === id);
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
    productList.innerHTML = "";
    console.log(productsToDisplay);
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
            <button onclick="viewProduct(${product.id})">View Product</button>
        `;
        productList.appendChild(productDiv);
    });
}

function viewProduct(prodcutId) {
    const product = products.find(p => p.id === prodcutId);
    if (!product) {
        return;
    }
    const productPage =  document.createElement("div");
    productPage.className = "product-details";
    productPage.innerHTML = `
            <h2>${product.title}</h2>
            <img src="${product.image}" alt="${product.title}">
            <p>${product.description}</p>
            <p>Price: $${product.price}</p>
            <button onclick="addToBasket(${product.id})">Add to Basket</button>
            <button onclick="closeProductPage()">Close</button>
        `;
    document.body.appendChild(productPage);
}



// const apiUrl = "https://v2.api.noroff.dev/rainy-days";

// function skrivDette(bokstaver, tall) {
//     console.log(bokstaver + tall);
// }
// skrivDette("Hei", 5);



window.addEventListener("load", (event) => {
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
fetchProducts();


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
// FIKS SÅNN AT JEG KAN ADDE MER ENN ETT PRODUKT AV GANGEN!!!!!!!!!!!!!
function addToBasket(productId) {
    const basket = JSON.parse(localStorage.getItem("basket")) || [];
    basket.push(productId);
    localStorage.setItem("basket", JSON.stringify(basket));
}

// Removes product by ID from basket in local storage
// FIKS SÅNN AT JEG KAN FJERNE EN BESTEMT AV ETT PRODUKT OG IKKE ALLE AV GANGEN!!!!!!!!!!!!! HINT (info om antall er nyttig)
function removeFromBasket(productId) {
    const basket = JSON.parse(localStorage.getItem("basket")) || [];
    const newBasket = basket.filter(id => id !== productId);
    localStorage.setItem("basket", JSON.stringify(newBasket));
}



function displayProducts(productsToDisplay) {
    productList.innerHTML = "";
    if (!productsToDisplay.length) {
        porductList.innerHTML = "<p>Noe Products found</p>";
        return;
    }
    productsToDisplay.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.className = "product";
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>Price: $${product.price}</p>
            <button onclick="viewProduct(${product.id})">View Product</button>
        `;
        productList.appendChild(productDiv);
    });
}

function viewProduct(prodcutID) {
    const product = products.find(p => p.id === prodcutID);
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




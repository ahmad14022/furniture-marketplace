let items = [];
let itemsInStorage = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];

// GET DATA FROM API
const fetchItems = () => {
    fetch('https://fakestoreapi.com/products')
        .then((response) => response.json())
        .then((data) => {
            let html = ``;
            const itemListContainer = document.querySelector('.product-list');

            items = data;

            // TO DISPLAY EACH PRODUCT
            data.forEach(element => {
                html += `
                    <div class="card product" data-id="${element.id}">
                        <div class="product-img-container">
                            <img src="${element.image}" alt="">
                        </div>
                        <p class="title">${element.title.substring(0, 20)}...</p>
                        <p class="category">${element.category}</p>
                        <p class="description">${element.description.substring(0, 100)}...</p>
                        <p class="price">$${element.price}</p>
                        <div class="button-container">
                            <button class="minus-qty">-</button>
                            <input class="input-qty" type="text" value="1">
                            <button class="plus-qty">+</button>
                            <button class="add-to-cart padding" onclick="addToCart(this)">Add to Cart</button>
                        </div>
                    </div>
                `;
            });

            itemListContainer.innerHTML = html;
        });
}

// TO DISPLAY A CART
const fetchCart = () => {
    const cartCountContainer = document.getElementById('cart-count');
    let cartCountValue = 0;
    const totalPriceValueContainer = document.getElementById('total-price-value');
    let totalPriceValue = 0;
    const addedItemContainer = document.querySelector('.added-item-container');
    let html = '';

    itemsInStorage.forEach(element => {
        cartCountValue++;
        totalPriceValue += element.price * element.qty;
        html += `
            <div class="added-item-list" data-id="${element.id}">
                <div class="added-item">
                    <p class="added-item-img"><img src="${element.image}" alt=""></p>
                    <div class="d-flex">
                        <p class="added-item-title">${element.title}</p>
                        <p class="added-item-price">$${(element.price * element.qty)}</p>
                    </div>
                </div>
                <div class="d-flex justify-content-end btn-cart">
                    <button class="minus-qty" onclick="increaseDecreaseQtyCard(this)">-</button>
                    <input class="input-qty" type="text" onchange="increaseDecreaseQtyCard(this)" value="${element.qty}">
                    <button class="plus-qty" onclick="increaseDecreaseQtyCard(this)">+</button>
                </div>
            </div>
        `;
    });

    totalPriceValueContainer.textContent = `$${totalPriceValue.toFixed(2)}`;
    cartCountContainer.textContent = cartCountValue;
    addedItemContainer.innerHTML = html;
}

// TO ADD ITEMS @THE CART
const addToCart = (element) => {
    const id = element.parentNode.parentNode.dataset.id;
    let rowItem = items.filter((value) => value.id == id)?.[0];
    itemsInStorage = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];

    let indexItemsInStorage = itemsInStorage.findIndex((value) => value.id == id);
    let qty = element.parentNode.querySelector('.input-qty').value;

    const addedItemContainer = document.querySelector('.added-item-container');
    let html = '';

    // IF ITEM IS NOT YET IN THE CART, ADD TO CART
    if (indexItemsInStorage == -1) {
        rowItem.qty = qty;
        itemsInStorage.push(rowItem);
    }
    //IF ITEM IS ALREADY IN THE CHART, UPDATE ITS QTY
    else {
        itemsInStorage[indexItemsInStorage].qty = qty;
    }
    localStorage.setItem('items', JSON.stringify(itemsInStorage));

    fetchCart();
}

//INCREASE OR DICREASE THE QTY OF ITEMS IN THE CART
const increaseDecreaseQtyCard = (element) => {
    const id = element.parentNode.parentNode.dataset.id;
    let inputQty = element.parentNode.querySelector('.input-qty').value;
    itemsInStorage = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];
    let indexItemsInStorage = itemsInStorage.findIndex((value) => value.id == id);

    if (element.classList.contains('plus-qty')) {
        inputQty = Number(inputQty) + 1;
    }
    else if (element.classList.contains('minus-qty')) {
        inputQty = Number(inputQty) - 1;
    }

    // IF THE RTY OF ITEMS IS LESS THAN OR EQUAL TO 0, REMOVE THE ITEM FROM THE CART
    if (inputQty <= 0) {
        itemsInStorage = itemsInStorage.filter((value) => value.id != id);
    }
    // IF THE QTY OF ITEMS IS GREATER THAN 0, UPDATE THE QTY
    else {
        itemsInStorage[indexItemsInStorage].qty = inputQty;
    }

    localStorage.setItem('items', JSON.stringify(itemsInStorage));
    fetchCart();
}

// LISTENING TO CLICKS ON THE PLUS AND MINUS BUTTONS IN THE PRODUCT LIST AND SHOPPING CART
let productListContainer = document.querySelector('.product-list');
let addedItemContainer = document.querySelector('.added-item-container');

productListContainer.addEventListener('click', increaseDecreaseQty);
addedItemContainer.addEventListener('click', increaseDecreaseQty);

// INCREASING OR DECREASING THE QTY OF ITEMS IN THE PRODUCT LIST AND SHOPPING CART
function increaseDecreaseQty(e) {
    if (e.target.classList.contains('plus-qty')) {
        const parentPlusQty = e.target.parentNode;
        let inputQty = parentPlusQty.querySelector('.input-qty');
        inputQty.value = Number(inputQty.value) + 1;
    } else if (e.target.classList.contains('minus-qty')) {
        const parentMinusQty = e.target.parentNode;
        let inputQty = parentMinusQty.querySelector('.input-qty');
        if (inputQty.value <= 1) {
            return;
        }
        inputQty.value = Number(inputQty.value) - 1;
    }
}

// FETCHING PRODUCT DATA AND DISPLAYING THE CART ON PAGE LOAD
fetchItems();
fetchCart();

// SHOWING OR HIDING THE CART WHEN THE CART BUTTON IS CLICKED
const cartIcon = document.getElementById('cart');
cartIcon.addEventListener('click', function () {
    const cartList = document.getElementById('cart-list');
    if (cartList.style.display === 'none') {
        cartList.style.display = 'block';
    } else {
        cartList.style.display = 'none';
    }
});

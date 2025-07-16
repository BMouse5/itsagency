let cartItems = [];

const basketContainer = document.querySelector(".basket-container");
const basketOpenBtn = document.querySelector(".basket");
const basketCloseBtn = document.querySelector('.basket-container .close');
const backdrop = document.querySelector('.dropdown-backdrop');
const body = document.body;
const cartListContainer = document.querySelector('.basket-container .list-container');
const cartTitle = document.querySelector('.basket-container .list-title span:first-child');
const cartTotalPriceEl = document.querySelector('.basket-footer .total-cost span:last-child');
const mainCartIconCounter = document.querySelector('.header .basket');
const clearCartBtn = document.querySelector('.basket-container .clear');


export function addProductToBasket(product) {
  const existingItem = cartItems.find(item => item.id === product.id);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cartItems.push({ ...product, quantity: 1 });
  }
  onCartChange();
}


export function decreaseProductInBasket(productId) {
    const itemIndex = cartItems.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        if (cartItems[itemIndex].quantity > 1) {
            cartItems[itemIndex].quantity--;
        } else {
            cartItems.splice(itemIndex, 1);
        }
        onCartChange();
    }
}

function onCartChange() {
  renderCart();
  updateCatalogButtons();
}

function renderCart() {
  if (!cartListContainer) return;
  cartListContainer.innerHTML = '';

  if (cartItems.length === 0) {
    cartListContainer.innerHTML = '<p class="no-products" style="padding: 20px; text-align: center;">Корзина пуста</p>';
  } else {
    cartItems.forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.classList.add('list-item');
      itemEl.dataset.id = item.id;
      itemEl.innerHTML = `
        <div class="item-img"><img src="${require("../../assets/img/basket.png")}" alt=""></div>
        <div class="item-description">
          <h4>${item.name}</h4>
          <span>${item.cost * item.quantity} ₽</span>
        </div>
        <div class="item-counter">
          <button class="decrease-btn" data-id="${item.id}">-</button>
          <span>${item.quantity}</span>
          <button class="increase-btn" data-id="${item.id}">+</button>
        </div>
        <div class="item-remove" data-id="${item.id}">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="pointer-events: none;"><g opacity="0.4"><path d="M18 6L6 18" stroke="#1F2020" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"></path><path d="M6 6L18 18" stroke="#1F2020" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"></path></g></svg>
        </div>
      `;
      cartListContainer.appendChild(itemEl);
    });
  }
  updateCartSummary();
}

function updateCartSummary() {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.cost * item.quantity), 0);
  if (cartTitle) {
    let text = 'товаров';
    if (totalItems === 1) text = 'товар';
    if (totalItems > 1 && totalItems < 5) text = 'товара';
    cartTitle.textContent = `${totalItems} ${text}`;
  }
  if (cartTotalPriceEl) {
    cartTotalPriceEl.textContent = `${totalPrice.toLocaleString('ru-RU')} ₽`;
  }
  if (mainCartIconCounter) {
    mainCartIconCounter.textContent = totalItems;
  }
}

export function updateCatalogButtons() {
    const catalogButtons = document.querySelectorAll('.catalog-grid .add-product');
    catalogButtons.forEach(button => {
        const productId = button.dataset.id;
        const itemInCart = cartItems.find(item => item.id === productId);

        if (itemInCart) {

            button.classList.add('in-cart');
            button.innerHTML = `
                <button class="catalog-decrease-btn" data-id="${productId}">
                    <svg width="12" height="2" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg" style="pointer-events: none;">
                        <path d="M1 1H11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <span>${itemInCart.quantity}</span>
                <button class="catalog-increase-btn" data-id="${productId}">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" style="pointer-events: none;">
                        <path d="M6 1V11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M1 6H11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            `;
        } else {
            button.classList.remove('in-cart');
            button.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style="pointer-events: none;">
                    <path d="M10 4.16663V15.8333" stroke="#1F2020" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                    <path d="M4.16699 10H15.8337" stroke="#1F2020" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
            `;
        }
    });
}

function setupEventListeners() {
    if (basketOpenBtn) {
        basketOpenBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            basketContainer.classList.add('active');
            updateBackdropAndScroll();
        });
    }
    if (basketCloseBtn) {
        basketCloseBtn.addEventListener('click', () => {
            basketContainer.classList.remove('active');
            updateBackdropAndScroll();
        });
    }
    if (cartListContainer) {
        cartListContainer.addEventListener('click', (e) => {
            const target = e.target;
            const increaseButton = target.closest('.increase-btn');
            const decreaseButton = target.closest('.decrease-btn');
            const removeButton = target.closest('.item-remove');
            if (increaseButton) {
                addProductToBasket({ id: increaseButton.dataset.id });
            } else if (decreaseButton) {
                decreaseProductInBasket(decreaseButton.dataset.id);
            } else if (removeButton) {
                cartItems = cartItems.filter(item => item.id !== removeButton.dataset.id);
                onCartChange();
            }
        });
    }
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            cartItems = [];
            onCartChange();
        });
    }
}

function updateBackdropAndScroll() {
    const isModalOpen = document.querySelector('.nav.active') || 
                        document.querySelector('.mobile-filters-popup.active') || 
                        document.querySelector('.basket-container.active');
    backdrop.style.display = isModalOpen ? 'block' : 'none';
    body.classList.toggle('no-scroll', isModalOpen);
}

setupEventListeners();
renderCart();
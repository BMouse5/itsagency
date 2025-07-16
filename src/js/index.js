import "../scss/style.scss";
import './components/slider';
import './components/dropdown';
import { addProductToBasket, decreaseProductInBasket, updateCatalogButtons } from './components/basket';
import axios from 'axios';

document.addEventListener('DOMContentLoaded', () => {
  const backdrop = document.querySelector('.dropdown-backdrop');
  const body = document.body;
  const burger = document.querySelector('.burger-menu');
  const nav = document.querySelector('.left-bar .nav');
  const mobileFilterToggle = document.querySelector('.mobile-filter-toggle');
  const mobileFiltersPopup = document.querySelector('.mobile-filters-popup');
  const basketContainer = document.querySelector(".basket-container");
  const updateBackdropAndScroll = () => {
    const isModalOpen = nav?.classList.contains('active') || mobileFiltersPopup?.classList.contains('active') || basketContainer?.classList.contains('active');
    backdrop.style.display = isModalOpen ? 'block' : 'none';
    body.classList.toggle('no-scroll', isModalOpen);
  };
  
  if (burger) {
    burger.addEventListener('click', () => {
      nav.classList.toggle('active');
      updateBackdropAndScroll();
    });
  }
  if(mobileFilterToggle) {
    mobileFilterToggle.addEventListener('click', () => {
      mobileFiltersPopup.classList.add('active');
      updateBackdropAndScroll();
    });
  }

  if (mobileFiltersPopup) {
    let isDragging = false;
    let startY = 0;
    let currentTranslate = 0;

    mobileFiltersPopup.addEventListener('touchstart', (e) => {
      isDragging = true;
      startY = e.touches[0].clientY;
      currentTranslate = 0;
      mobileFiltersPopup.style.transition = 'none';
    });

    mobileFiltersPopup.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      e.preventDefault()
      const currentY = e.touches[0].clientY;
      currentTranslate = currentY - startY;

      if (currentTranslate > 0) {
        mobileFiltersPopup.style.transform = `translateY(${currentTranslate}px)`;
      }
    });

    mobileFiltersPopup.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;
      mobileFiltersPopup.style.transition = '';

      const closeThreshold = mobileFiltersPopup.offsetHeight / 3;

      if (currentTranslate > closeThreshold) {
        mobileFiltersPopup.classList.remove('active');
        updateBackdropAndScroll();
      } else {
        mobileFiltersPopup.style.transform = '';
      }
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', () => {
      nav?.classList.remove('active');
      mobileFiltersPopup?.classList.remove('active');
      basketContainer?.classList.remove('active');
      updateBackdropAndScroll();
    });
  }
  let allProducts = [];
  const catalogGrid = document.querySelector('.catalog-grid');
  const catalogCountEl = document.querySelector('.catalog-count');
  
  function renderProducts(products) {
    if (!catalogGrid) return;
    catalogGrid.innerHTML = '';
    if (products.length === 0) {
      catalogGrid.innerHTML = '<p class="no-products">Товары с выбранными параметрами не найдены</p>';
    } else {
      products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.id = product.id;
        card.innerHTML = `
          <div class="card-img">
              <img src="${require('../assets/img/card.png')}" alt="">
          </div>
          <h3>${product.name}</h3>
          <div class="card-footer">
              <span>${product.cost} ₽</span>
              <div class="add-product" data-id="${product.id}">
                  <!-- Содержимое будет вставлено функцией updateCatalogButtons -->
              </div>
          </div>
        `;
        catalogGrid.appendChild(card);
      });
    }

    updateCatalogButtons();

    if (catalogCountEl) {
        let text = 'товаров';
        const count = products.length;
        const lastDigit = count % 10;
        const lastTwoDigits = count % 100;
        if(lastTwoDigits < 11 || lastTwoDigits > 14) {
            if(lastDigit === 1) text = 'товар';
            if(lastDigit >= 2 && lastDigit <=4) text = 'товара';
        }
        catalogCountEl.textContent = `${count} ${text}`;
    }
  }

  function applyFiltersAndSort() {
    const filterMap = { 'Есть в наличии': 'inStock', 'Контрактные': 'isContract', 'Эксклюзивные': 'isExclusive', 'Распродажа': 'isSale' };
    const activeFilterKeys = new Set();
    let isNewCheckboxActive = false;
    document.querySelectorAll('.filter-switch input:checked').forEach(input => {
      const labelSpan = input.parentElement.nextElementSibling;
      if (labelSpan) {
        const labelText = labelSpan.textContent.trim();
        if (labelText === 'Новинки') isNewCheckboxActive = true;
        else { const apiKey = filterMap[labelText]; if (apiKey) activeFilterKeys.add(apiKey); }
      }
    });
    let filteredProducts = allProducts.filter(product => {
      for (const key of activeFilterKeys) if (product[key] !== true) return false;
      return true;
    });
    const dropdownSelection = document.querySelector('.dropdown-menu li.active')?.textContent.trim() || 'Сначала дорогие';
    if (isNewCheckboxActive || dropdownSelection === 'Сначала новые') {
      filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      switch (dropdownSelection) {
        case 'Сначала дорогие': filteredProducts.sort((a, b) => b.cost - a.cost); break;
        case 'Сначала недорогие': filteredProducts.sort((a, b) => a.cost - b.cost); break;
        case 'Сначала популярные': filteredProducts.sort((a, b) => (b.popular === a.popular) ? 0 : b.popular ? 1 : -1); break;
      }
    }
    renderProducts(filteredProducts);
  }

  axios.get(`https://6877d33adba809d901f1093a.mockapi.io/api/orders`)
    .then(response => {
      allProducts = response.data;
      document.querySelectorAll('.filter-switch input[type="checkbox"]').forEach(c => c.addEventListener('change', applyFiltersAndSort));
      document.querySelectorAll('.dropdown-menu li').forEach(li => li.addEventListener('click', () => setTimeout(applyFiltersAndSort, 0)));
      applyFiltersAndSort();
    })
    .catch(error => {
      console.log('Ошибка при получении данных:', error);
      if (catalogGrid) catalogGrid.innerHTML = '<p class="no-products error">Не удалось загрузить товары.</p>';
    });

  if (catalogGrid) {
    catalogGrid.addEventListener('click', (event) => {
        const target = event.target;
        
        const buttonContainer = target.closest('.add-product');
        if (!buttonContainer) return;
        
        const productId = buttonContainer.dataset.id;
        const product = allProducts.find(p => p.id === productId);
        if (!product) return;

        if (target.matches('.catalog-increase-btn')) {
            addProductToBasket(product);
        } else if (target.matches('.catalog-decrease-btn')) {
            decreaseProductInBasket(productId);
        } else if (!buttonContainer.classList.contains('in-cart')) {
            addProductToBasket(product);
        }
    });
  }
});
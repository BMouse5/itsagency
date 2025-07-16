import "../scss/style.scss";
import './components/slider';
import './components/dropdown';
import './components/basket';
import axios from 'axios';

document.addEventListener('DOMContentLoaded', () => {
  // --- КОД ИНТЕРФЕЙСА (НЕ ТРОНУТ) ---
  const phoneEl = document.querySelector('.contacts__phone');
  if (phoneEl) {
    phoneEl.dataset.tooltip = '';
    phoneEl.addEventListener('click', () => {
      const phone = phoneEl.dataset.phone;
      navigator.clipboard.writeText(phone)
        .then(() => {
          phoneEl.dataset.tooltip = 'Скопировано';
          phoneEl.classList.add('tooltip-visible');
          setTimeout(() => {
            phoneEl.classList.remove('tooltip-visible');
            phoneEl.dataset.tooltip = '';
          }, 2000);
        })
        .catch((err) => {
          console.error('Ошибка копирования:', err);
        });
    });
  }
  const backdrop = document.querySelector('.dropdown-backdrop');
  const body = document.body;
  const burger = document.querySelector('.burger-menu');
  const nav = document.querySelector('.left-bar .nav');
  let closeBurgerMenu;
  if (burger && nav && backdrop && body) {
    closeBurgerMenu = () => {
      burger.classList.remove('active');
      nav.classList.remove('active');
      backdrop.style.display = 'none';
      body.classList.remove('no-scroll');
    };
    const openBurgerMenu = () => {
      burger.classList.add('active');
      nav.classList.add('active');
      backdrop.style.display = 'block';
      body.classList.add('no-scroll');
    };
    burger.addEventListener('click', (e) => {
      e.stopPropagation();
      if (nav.classList.contains('active')) {
        closeBurgerMenu();
      } else {
        openBurgerMenu();
      }
    });
  }
  const mobileFilterToggle = document.querySelector('.mobile-filter-toggle');
  const mobileFiltersPopup = document.querySelector('.mobile-filters-popup');
  let closeFilters;
  if (mobileFilterToggle && mobileFiltersPopup && backdrop && body) {
    const openFilters = () => {
      mobileFiltersPopup.style.transform = '';
      mobileFiltersPopup.classList.add('active');
      backdrop.style.display = 'block';
      body.classList.add('no-scroll');
    };
    closeFilters = () => {
      mobileFiltersPopup.style.transform = '';
      mobileFiltersPopup.classList.remove('active');
      backdrop.style.display = 'none';
      body.classList.remove('no-scroll');
    };
    mobileFilterToggle.addEventListener('click', openFilters);
    let isDragging = false;
    let startY = 0;
    let currentTranslate = 0;
    mobileFiltersPopup.addEventListener('touchstart', (e) => {
      isDragging = true;
      startY = e.touches[0].clientY;
      currentTranslate = 0;
      mobileFiltersPopup.classList.add('no-transition');
    });
    mobileFiltersPopup.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const currentY = e.touches[0].clientY;
      currentTranslate = currentY - startY;
      if (currentTranslate < 0) {
        currentTranslate = 0;
      }
      mobileFiltersPopup.style.transform = `translateY(${currentTranslate}px)`;
    });
    mobileFiltersPopup.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;
      mobileFiltersPopup.classList.remove('no-transition');
      const closeThreshold = mobileFiltersPopup.offsetHeight / 3;
      if (currentTranslate > closeThreshold) {
        closeFilters();
      } else {
        mobileFiltersPopup.style.transform = '';
      }
    });
  }
  if (backdrop) {
    backdrop.addEventListener('click', () => {
      if (nav && nav.classList.contains('active')) {
        closeBurgerMenu();
      }
      if (mobileFiltersPopup && mobileFiltersPopup.classList.contains('active')) {
        closeFilters();
      }
    });
  }
  // --- КОНЕЦ КОДА ИНТЕРФЕЙСА ---


  // --- НАЧАЛО РАБОЧЕЙ ЛОГИКИ ФИЛЬТРАЦИИ ---

  let allProducts = [];
  const catalogGrid = document.querySelector('.catalog-grid');
  const catalogCountEl = document.querySelector('.catalog-count');

  const filterMap = {
    // 'Новинки' теперь не используется как ключ фильтра, а только как триггер для сортировки
    'Есть в наличии': 'inStock',
    'Контрактные': 'isContract',
    'Эксклюзивные': 'isExclusive',
    'Распродажа': 'isSale'
  };

  function renderProducts(products) {
    if (!catalogGrid) return;
    catalogGrid.innerHTML = '';

    if (products.length === 0) {
      catalogGrid.innerHTML = '<p class="no-products">Товары с выбранными параметрами не найдены</p>';
    } else {
      products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
          <div class="card-img">
              <img src="${require('../assets/img/card.png')}" alt="">
          </div>
          <h3>${product.name}</h3>
          <div class="card-footer">
              <span>${product.cost} ₽</span>
              <button class="add-product">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 4.16663V15.8333" stroke="#1F2020" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M4.16699 10H15.8337" stroke="#1F2020" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
              </button>
          </div>
        `;
        catalogGrid.appendChild(card);
      });
    }

    if (catalogCountEl) {
      let text = 'товаров';
      const count = products.length;
      const lastDigit = count % 10;
      const lastTwoDigits = count % 100;
      if (lastTwoDigits < 11 || lastTwoDigits > 14) {
        if (lastDigit === 1) text = 'товар';
        if (lastDigit >= 2 && lastDigit <= 4) text = 'товара';
      }
      catalogCountEl.textContent = `${count} ${text}`;
    }
  }

  function applyFiltersAndSort() {
    // 1. Собираем активные switch-фильтры (кроме "Новинки") и проверяем, активен ли чекбокс "Новинки"
    const activeFilterKeys = new Set();
    let isNewCheckboxActive = false;

    document.querySelectorAll('.filter-switch input:checked').forEach(input => {
      const labelSpan = input.parentElement.nextElementSibling;
      if (labelSpan) {
        const labelText = labelSpan.textContent.trim();
        if (labelText === 'Новинки') {
          isNewCheckboxActive = true;
        } else {
          const apiKey = filterMap[labelText];
          if (apiKey) {
            activeFilterKeys.add(apiKey);
          }
        }
      }
    });

    // 2. Фильтруем товары по чекбоксам (inStock, isSale и т.д.)
    let filteredProducts = allProducts.filter(product => {
      for (const key of activeFilterKeys) {
        if (product[key] !== true) {
          return false;
        }
      }
      return true;
    });

    // 3. Сортируем отфильтрованный список
    const dropdownSelection = document.querySelector('.dropdown-menu li.active')?.textContent.trim() || 'Сначала дорогие';
    
    // Если активен чекбокс "Новинки" ИЛИ в дропдауне выбрано "Сначала новые", применяем сортировку по дате.
    if (isNewCheckboxActive || dropdownSelection === 'Сначала новые') {
      filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      // Иначе применяем сортировку из выпадающего списка
      switch (dropdownSelection) {
        case 'Сначала дорогие':
          filteredProducts.sort((a, b) => b.cost - a.cost);
          break;
        case 'Сначала недорогие':
          filteredProducts.sort((a, b) => a.cost - b.cost);
          break;
        case 'Сначала популярные':
          filteredProducts.sort((a, b) => (b.popular === a.popular) ? 0 : b.popular ? 1 : -1);
          break;
        // കേസ് 'Сначала новые' уже обработан выше
      }
    }

    // 4. Перерисовываем список товаров
    renderProducts(filteredProducts);
  }

  // Получаем данные с сервера и устанавливаем обработчики
  axios.get(`https://6877d33adba809d901f1093a.mockapi.io/api/orders`)
    .then(response => {
      allProducts = response.data;

      document.querySelectorAll('.filter-switch input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', applyFiltersAndSort);
      });

      document.querySelectorAll('.dropdown-menu li').forEach(li => {
        li.addEventListener('click', () => {
          setTimeout(applyFiltersAndSort, 0);
        });
      });

      // Выполняем первую отрисовку
      applyFiltersAndSort();
    })
    .catch(error => {
      console.log('Ошибка при получении данных:', error);
      if (catalogGrid) {
        catalogGrid.innerHTML = '<p class="no-products error">Не удалось загрузить товары.</p>';
      }
    });
});
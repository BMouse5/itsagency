import "../scss/style.scss";
import './components/slider';
import './components/dropdown';
import './components/basket';
import axios from 'axios';

document.addEventListener('DOMContentLoaded', () => {
  // Ваш код для копирования телефона (оставляем без изменений)
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

  // Общие элементы
  const backdrop = document.querySelector('.dropdown-backdrop');
  const body = document.body;

  // --- ЛОГИКА БУРГЕР-МЕНЮ ---
  const burger = document.querySelector('.burger-menu');
  const nav = document.querySelector('.left-bar .nav');

  if (burger && nav && backdrop && body) {
    const closeBurgerMenu = () => {
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
      // Если меню уже открыто, закрываем, иначе открываем
      if (nav.classList.contains('active')) {
        closeBurgerMenu();
      } else {
        openBurgerMenu();
      }
    });
  }
  const mobileFilterToggle = document.querySelector('.mobile-filter-toggle');
  const mobileFiltersPopup = document.querySelector('.mobile-filters-popup');

  if (mobileFilterToggle && mobileFiltersPopup && backdrop && body) {
    
    // Функции для управления состоянием
    const openFilters = () => {
      mobileFiltersPopup.style.transform = '';
      mobileFiltersPopup.classList.add('active');
      backdrop.style.display = 'block';
      body.classList.add('no-scroll');
    };
    
    const closeFilters = () => {
      // Сначала убираем инлайновый стиль, чтобы CSS мог взять управление
      mobileFiltersPopup.style.transform = ''; 

      // Затем выполняем остальные действия
      mobileFiltersPopup.classList.remove('active');
      backdrop.style.display = 'none';
      body.classList.remove('no-scroll');
    };

    mobileFilterToggle.addEventListener('click', openFilters);

    // Переменные для логики перетаскивания
    let isDragging = false;
    let startY = 0;
    let currentTranslate = 0;

    mobileFiltersPopup.addEventListener('touchstart', (e) => {
      isDragging = true;
      startY = e.touches[0].clientY;
      mobileFiltersPopup.classList.add('no-transition');
    });

    mobileFiltersPopup.addEventListener('touchmove', (e) => {
      if (!isDragging) return;

      // ==========================================================
      //                        ВОТ КЛЮЧЕВОЕ ИЗМЕНЕНИЕ
      // ==========================================================
      // Предотвращаем стандартное поведение браузера (скролл страницы)
      // Это нужно делать именно в 'touchmove'.
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

      const closeThreshold = 30;

      if (currentTranslate > closeThreshold) {
        closeFilters();
      } else {
        mobileFiltersPopup.style.transform = '';
      }
    });
  }
});
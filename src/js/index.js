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
  let closeBurgerMenu; // Объявляем функцию здесь, чтобы она была доступна везде

  if (burger && nav && backdrop && body) {
    // Присваиваем функцию здесь
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

  // --- ЛОГИКА МОБИЛЬНЫХ ФИЛЬТРОВ ---
  const mobileFilterToggle = document.querySelector('.mobile-filter-toggle');
  const mobileFiltersPopup = document.querySelector('.mobile-filters-popup');
  let closeFilters; // Объявляем функцию здесь

  if (mobileFilterToggle && mobileFiltersPopup && backdrop && body) {
    const openFilters = () => {
      mobileFiltersPopup.style.transform = '';
      mobileFiltersPopup.classList.add('active');
      backdrop.style.display = 'block';
      body.classList.add('no-scroll');
    };
    
    // Присваиваем функцию здесь
    closeFilters = () => {
      mobileFiltersPopup.style.transform = '';
      mobileFiltersPopup.classList.remove('active');
      backdrop.style.display = 'none';
      body.classList.remove('no-scroll');
    };

    mobileFilterToggle.addEventListener('click', openFilters);

    // Логика свайпа (оставляем без изменений)
    let isDragging = false;
    let startY = 0;
    let currentTranslate = 0;
    mobileFiltersPopup.addEventListener('touchstart', (e) => { /* ... */ });
    mobileFiltersPopup.addEventListener('touchmove', (e) => { /* ... */ });
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

  // ===================================================================
  //          ВОТ ДОБАВЛЕННЫЙ БЛОК: ЗАКРЫТИЕ ПО КЛИКУ НА ФОН
  // ===================================================================
  if (backdrop) {
    backdrop.addEventListener('click', () => {
      // Проверяем, открыто ли бургер-меню, и если да - закрываем
      if (nav && nav.classList.contains('active')) {
        closeBurgerMenu(); // Вызываем нашу готовую функцию
      }

      // Проверяем, открыт ли попап с фильтрами, и если да - закрываем
      if (mobileFiltersPopup && mobileFiltersPopup.classList.contains('active')) {
        closeFilters(); // Вызываем нашу готовую функцию
      }
    });
  }
});
import "../scss/style.scss";
import './components/slider';
import './components/dropdown';
import './components/basket';
import axios from 'axios';

document.addEventListener('DOMContentLoaded', () => {
  // --- КОПИРОВАНИЕ ТЕЛЕФОНА (оставляем без изменений) ---
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

  // --- ОБЩИЕ ЭЛЕМЕНТЫ ДЛЯ МЕНЮ И ПОПАПОВ ---
  const backdrop = document.querySelector('.dropdown-backdrop');
  const body = document.body;

  // --- ЛОГИКА БУРГЕР-МЕНЮ ---
  const burger = document.querySelector('.burger-menu');
  const nav = document.querySelector('.left-bar .nav');

  if (burger && nav && backdrop && body) {
    const toggleBurgerMenu = () => {
      burger.classList.toggle('active'); // Для анимации в крестик (если понадобится)
      nav.classList.toggle('active');
      backdrop.classList.toggle('active');
      body.classList.toggle('no-scroll');
    };

    burger.addEventListener('click', (e) => {
      e.stopPropagation(); // ВАЖНО: чтобы клик по бургеру не закрыл меню сразу
      toggleBurgerMenu();
    });

    // Закрываем меню по клику на ссылку
    nav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', toggleBurgerMenu);
    });
  }

  // --- ЛОГИКА МОБИЛЬНЫХ ФИЛЬТРОВ ---
  const mobileFilterToggle = document.querySelector('.mobile-filter-toggle');
  const mobileFiltersPopup = document.querySelector('.mobile-filters-popup');
  const closeFiltersBtn = document.querySelector('.close-filters');

  if (mobileFilterToggle && mobileFiltersPopup && closeFiltersBtn && backdrop && body) {
    const openFilters = () => {
      mobileFiltersPopup.classList.add('active');
      backdrop.classList.add('active');
      body.classList.add('no-scroll');
    };

    const closeFilters = () => {
      mobileFiltersPopup.classList.remove('active');
      // Закрываем фон, только если главное меню (бургер) тоже закрыто
      if (!nav.classList.contains('active')) {
        backdrop.classList.remove('active');
        body.classList.remove('no-scroll');
      }
    };

    mobileFilterToggle.addEventListener('click', openFilters);
    closeFiltersBtn.addEventListener('click', closeFilters);
  }

  // --- ОБЩИЙ СЛУШАТЕЛЬ ДЛЯ ЗАКРЫТИЯ ПО ФОНУ ---
  if (backdrop) {
      backdrop.addEventListener('click', () => {
          // Если открыто меню бургера - закрываем его
          if (nav && nav.classList.contains('active')) {
              burger.classList.remove('active');
              nav.classList.remove('active');
              backdrop.classList.remove('active');
              body.classList.remove('no-scroll');
          }
          // Если открыты фильтры - закрываем их
          if (mobileFiltersPopup && mobileFiltersPopup.classList.contains('active')) {
              mobileFiltersPopup.classList.remove('active');
              backdrop.classList.remove('active');
              body.classList.remove('no-scroll');
          }
      });
  }
});
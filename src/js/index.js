import "../scss/style.scss";
import './components/slider';
import './components/dropdown';
import './components/basket';
import axios from 'axios';

document.addEventListener('DOMContentLoaded', () => {
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
});
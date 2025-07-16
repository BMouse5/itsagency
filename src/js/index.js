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

  // --- ЛОГИКА МОБИЛЬНЫХ ФИЛЬТРОВ ---
  const mobileFilterToggle = document.querySelector('.mobile-filter-toggle');
  const mobileFiltersPopup = document.querySelector('.mobile-filters-popup');

  if (mobileFilterToggle && mobileFiltersPopup && backdrop && body) {
    
    // Функции для управления состоянием
    const openFilters = () => {
      mobileFiltersPopup.style.transform = ''; // Сбрасываем инлайн-стили на всякий случай
      mobileFiltersPopup.classList.add('active');
      backdrop.style.display = 'block';
      body.classList.add('no-scroll');
    };
    
    const closeFilters = () => {
      mobileFiltersPopup.classList.remove('active');
      backdrop.style.display = 'none';
      body.classList.remove('no-scroll');
    };

    // Слушатель на кнопку "Фильтры"
    mobileFilterToggle.addEventListener('click', openFilters);

    // Переменные для логики перетаскивания
    let isDragging = false;
    let startY = 0;
    let currentTranslate = 0;

    mobileFiltersPopup.addEventListener('touchstart', (e) => {
      // Начинаем перетаскивание, только если касание внутри самого попапа
      isDragging = true;
      startY = e.touches[0].clientY;
      // Убираем transition, чтобы попап не отставал от пальца
      mobileFiltersPopup.classList.add('no-transition');
    });

    mobileFiltersPopup.addEventListener('touchmove', (e) => {
      if (!isDragging) return;

      const currentY = e.touches[0].clientY;
      currentTranslate = currentY - startY;

      // Не даём тащить попап выше его начального положения
      if (currentTranslate < 0) {
        currentTranslate = 0;
      }

      // Применяем смещение в реальном времени
      mobileFiltersPopup.style.transform = `translateY(${currentTranslate}px)`;
    });

    mobileFiltersPopup.addEventListener('touchend', () => {
      if (!isDragging) return;

      isDragging = false;
      // Возвращаем transition для плавной анимации
      mobileFiltersPopup.classList.remove('no-transition');

      // Порог для закрытия (например, 1/3 высоты попапа)
      const closeThreshold = mobileFiltersPopup.offsetHeight / 3;

      if (currentTranslate > closeThreshold) {
        // Если утащили достаточно далеко - закрываем
        closeFilters();
      } else {
        // Иначе - плавно возвращаем на место, убирая инлайн-стиль
        mobileFiltersPopup.style.transform = '';
      }
    });
  }

  // ... остальной код, включая обработчик для backdrop ...
  if (backdrop) {
    backdrop.addEventListener('click', () => {
      // Закрываем бургер-меню, если оно открыто
      if (nav && nav.classList.contains('active')) {
        // ... (ваш код для закрытия бургера)
        burger.classList.remove('active');
        nav.classList.remove('active');
        backdrop.style.display = 'none';
        body.classList.remove('no-scroll');
      }

      // Закрываем попап с фильтрами, если он открыт
      if (mobileFiltersPopup && mobileFiltersPopup.classList.contains('active')) {
        // Вызываем нашу функцию закрытия
        closeFilters(); 
      }
    });
  }
});
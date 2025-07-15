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
});


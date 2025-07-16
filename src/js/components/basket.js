document.addEventListener('DOMContentLoaded', () => {
  const visibleBtn = document.querySelector(".basket");
  const basketContainer = document.querySelector(".basket-container");
  const closeBtn = document.querySelector('.close');

  visibleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    basketContainer.classList.add('active');
  });

  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    basketContainer.classList.remove('active');
  });

  basketContainer.addEventListener('click', (e) => {
    e.stopPropagation(); // Клик внутри корзины не закрывает её
  });

  document.addEventListener('click', () => {
    basketContainer.classList.remove('active');
  });
});

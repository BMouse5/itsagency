document.addEventListener('DOMContentLoaded', () => {
  const visibleBtn = document.querySelector(".basket");
  const basketContainer = document.querySelector(".basket-container");
  const closeBtn = document.querySelector('.close')
  visibleBtn.addEventListener('click', (e) => {
    basketContainer.classList.toggle('active');
    e.stopPropagation();
  });

  closeBtn.addEventListener('click', (e) => {
    basketContainer.classList.remove('active');
    e.stopPropagation();
  })

  basketContainer.addEventListener('click', (e) => {
    e.stopPropagation(); // чтобы клик внутри корзины не закрывал её
  });

  document.addEventListener('click', () => {
    basketContainer.classList.remove('active');
  });
});

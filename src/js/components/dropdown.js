document.addEventListener('DOMContentLoaded', () => {
    const dropdown = document.querySelector('.dropdown');
    const toggle = dropdown.querySelector('.dropdown-toggle');
    const menu = dropdown.querySelector('.dropdown-menu');
    const label = dropdown.querySelector('.dropdown-label');
    const items = dropdown.querySelectorAll('li');
    
    const backdrop = document.createElement('div');
    backdrop.classList.add('dropdown-backdrop');
    document.body.appendChild(backdrop);

    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.style.display = 'block';
        backdrop.style.display = 'block';
    });

    document.addEventListener('click', () => {
        menu.style.display = 'none';
        backdrop.style.display = 'none';
    });

    dropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    items.forEach(item => {
        item.addEventListener('click', () => {

            items.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            label.textContent = item.textContent;

            menu.style.display = 'none';
            backdrop.style.display = 'none';
        });
    });
});


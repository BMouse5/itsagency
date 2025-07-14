document.addEventListener('DOMContentLoaded', () => {
    const slidesContainer = document.querySelector('.slides');
    const slides = document.querySelectorAll('.slide');
    const radios = document.querySelectorAll('input[name="slider"]');
    const leftBtn = document.querySelector('.arrow.left');
    const rightBtn = document.querySelector('.arrow.right');

    let currentIndex = 0;

    const updateSLider = () => {
        const offset = -currentIndex * 100;
        slidesContainer.style.transform = `translateX(${offset}vw)`;

        if(radios[currentIndex]) {
            radios[currentIndex].checked = true
        }
    };

    radios.forEach((radio, index) => {
        radio.addEventListener('change', () => {
            currentIndex = index;
            updateSLider();
        });
    });

    leftBtn?.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSLider()
    });
    
    rightBtn?.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSLider();
    })

    setInterval(() => {
        rightBtn.click();
    }, 5000)
})
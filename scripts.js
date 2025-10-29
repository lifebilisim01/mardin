const mobileMenuButton = document.querySelector('.mobile-menu');
const navigation = document.querySelector('.main-nav');
const yearElement = document.getElementById('year');

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

if (mobileMenuButton && navigation) {
    mobileMenuButton.addEventListener('click', () => {
        const isOpen = navigation.classList.toggle('open');
        mobileMenuButton.setAttribute('aria-expanded', isOpen);
        navigation.style.display = isOpen ? 'flex' : '';
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 960) {
            navigation.classList.remove('open');
            navigation.style.display = '';
            mobileMenuButton.removeAttribute('aria-expanded');
        }
    });
}

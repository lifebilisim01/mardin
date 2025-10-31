const mobileMenuButton = document.querySelector('.mobile-menu');
const navigation = document.querySelector('.main-nav');
const yearElement = document.getElementById('year');
const metricValues = document.querySelectorAll('.metric-value');
const faqItems = document.querySelectorAll('.faq-item');

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

if (mobileMenuButton && navigation) {
    mobileMenuButton.setAttribute('aria-expanded', 'false');

    mobileMenuButton.addEventListener('click', () => {
        const isOpen = navigation.classList.toggle('open');
        mobileMenuButton.setAttribute('aria-expanded', isOpen);
        navigation.style.display = isOpen ? 'flex' : '';
    });

    navigation.addEventListener('click', (event) => {
        const target = event.target;
        if (target instanceof HTMLAnchorElement && navigation.classList.contains('open')) {
            navigation.classList.remove('open');
            navigation.style.display = '';
            mobileMenuButton.setAttribute('aria-expanded', 'false');
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 960) {
            navigation.classList.remove('open');
            navigation.style.display = '';
            mobileMenuButton.removeAttribute('aria-expanded');
        }
    });
}

if (metricValues.length > 0) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const animateValue = (element) => {
        const target = parseFloat(element.dataset.target);
        const isPercentage = element.nextElementSibling?.textContent?.trim().startsWith('%');
        const duration = 1600;
        const start = performance.now();

        const update = (timestamp) => {
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = target * eased;
            element.textContent = isPercentage ? value.toFixed(1) : Math.round(value).toLocaleString('tr-TR');
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    };

    const observer =
        'IntersectionObserver' in window
            ? new IntersectionObserver(
                  (entries, obs) => {
                      entries.forEach((entry) => {
                          if (entry.isIntersecting) {
                              animateValue(entry.target);
                              obs.unobserve(entry.target);
                          }
                      });
                  },
                  { threshold: 0.4 }
              )
            : null;

    metricValues.forEach((value) => {
        if (prefersReducedMotion || !observer) {
            const target = parseFloat(value.dataset.target);
            const isPercentage = value.nextElementSibling?.textContent?.trim().startsWith('%');
            value.textContent = isPercentage ? target.toFixed(1) : Math.round(target).toLocaleString('tr-TR');
            return;
        }

        observer.observe(value);
    });
}

if (faqItems.length > 0) {
    faqItems.forEach((item) => {
        const content = item.querySelector('.faq-content');
        if (content) {
            content.setAttribute('hidden', '');
        }

        item.addEventListener('click', () => {
            const isExpanded = item.getAttribute('aria-expanded') === 'true';
            faqItems.forEach((btn) => {
                if (btn !== item) {
                    btn.setAttribute('aria-expanded', 'false');
                    btn.classList.remove('open');
                    const siblingContent = btn.querySelector('.faq-content');
                    siblingContent?.setAttribute('hidden', '');
                }
            });
            item.setAttribute('aria-expanded', String(!isExpanded));
            item.classList.toggle('open', !isExpanded);
            if (content) {
                if (!isExpanded) {
                    content.removeAttribute('hidden');
                } else {
                    content.setAttribute('hidden', '');
                }
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Add subtle animations to features
    const features = document.querySelectorAll('.feature');
    features.forEach(feature => {
        feature.addEventListener('mouseenter', () => {
            feature.style.transform = 'scale(1.05)';
            feature.style.boxShadow = '0 10px 20px rgba(124, 58, 237, 0.2)';
        });

        feature.addEventListener('mouseleave', () => {
            feature.style.transform = 'scale(1)';
            feature.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
        });
    });

    // Button interaction effects
    const ctaButton = document.querySelector('.cta-button');
    ctaButton.addEventListener('click', () => {
        ctaButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            ctaButton.style.transform = 'scale(1)';
        }, 100);
    });

    // Scroll-activated animations
    const observerOptions = {
        threshold: 0.1
    };

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('.features, .benefits');
    sections.forEach(section => {
        fadeInObserver.observe(section);
    });
});
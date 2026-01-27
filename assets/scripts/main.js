// js/main.js
document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       [NEW] Intro Screen Logic (Game Start)
    ========================================= */
    const introScreen = document.getElementById('intro-screen');
    const startButton = document.getElementById('start-button');
    const portfolioContent = document.getElementById('portfolio-content');

    if (startButton) {
        startButton.addEventListener('click', () => {
            // 1. 인트로 스크린 페이드 아웃
            introScreen.classList.add('fade-out');

            // 2. 인트로가 완전히 사라진 후 (0.8초 뒤) 메인 콘텐츠 표시
            setTimeout(() => {
                introScreen.style.display = 'none';
                portfolioContent.style.display = 'block';
                // 약간의 딜레이 후 페이드 인 적용 (부드럽게)
                setTimeout(() => {
                    portfolioContent.classList.add('fade-in');
                }, 50);
            }, 800); // CSS animation duration과 맞춰야 함
        });
    }


    /* =========================================
       Existing Navigation Logic (기존 코드 유지)
    ========================================= */
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
});
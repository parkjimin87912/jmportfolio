// js/main.js

document.addEventListener('DOMContentLoaded', () => {

    /* 1. Intro Screen Logic */
    const introScreen = document.getElementById('intro-screen');
    const startButton = document.getElementById('start-button');
    const portfolioContent = document.getElementById('portfolio-content');

    if (startButton) {
        startButton.addEventListener('click', () => {
            introScreen.classList.add('fade-out');
            setTimeout(() => {
                introScreen.style.display = 'none';
                portfolioContent.style.display = 'block';
                setTimeout(() => {
                    portfolioContent.classList.add('fade-in');
                }, 50);
            }, 800);
        });
    }

    /* 2. Scroll Reveal Animation (레퍼런스 사이트 효과) */
    const hiddenSections = document.querySelectorAll('.hidden-section');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-section');
            }
        });
    }, { threshold: 0.15 }); // 15% 정도 보이면 등장

    hiddenSections.forEach(section => {
        revealObserver.observe(section);
    });


    /* 3. Navigation Active State */
    const sections = document.querySelectorAll('section'); // 모든 섹션 감지
    const navLinks = document.querySelectorAll('.nav-link');

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                // Intro 화면은 네비게이션에 없으므로 제외
                if(id === 'intro-screen') return;

                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => {
        navObserver.observe(section);
    });

});
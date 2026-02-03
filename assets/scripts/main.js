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
                // 메인 컨텐츠가 나타날 때 살짝 딜레이를 주어 부드럽게
                setTimeout(() => {
                    portfolioContent.classList.add('fade-in');
                }, 50);
            }, 800);
        });
    }

    /* 2. Scroll Reveal Animation */
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    /* 3. Navigation Active State */
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                if(id === 'intro-screen') return;

                navLinks.forEach(link => {
                    link.classList.remove('active');
                    // href 속성값 매칭
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
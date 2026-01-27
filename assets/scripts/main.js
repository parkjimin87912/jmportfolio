// js/main.js
document.addEventListener('DOMContentLoaded', () => {

    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    // 옵션: 섹션이 화면의 50% 이상 보이면 감지
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');

                // 기존 active 제거
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });

                // 현재 섹션 링크에 active 추가
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
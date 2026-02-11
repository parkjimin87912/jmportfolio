// js/main.js

document.addEventListener('DOMContentLoaded', () => {

    /* 0. EmailJS Init */
    // [중요] 본인의 EmailJS Public Key를 입력해야 합니다.
    // 회원가입 후 https://dashboard.emailjs.com/admin/account 에서 확인 가능
    // 예: emailjs.init("YOUR_PUBLIC_KEY");
    // 테스트를 위해 임시 키를 넣거나, 나중에 직접 수정해야 함.
    if (typeof emailjs !== 'undefined') {
        emailjs.init("dhEl8FrNz4axqZv1I");
    }

    /* 1. Intro Screen Logic */
    const introScreen = document.getElementById('intro-screen');
    const startButton = document.getElementById('start-button');
    const portfolioContent = document.getElementById('portfolio-content');
    const contentContainer = document.querySelector('.content'); // 가로 스크롤 컨테이너
    const expFill = document.querySelector('.exp-fill'); // EXP Bar 채우기 요소
    const expBarContainer = document.querySelector('.exp-bar-container'); // EXP Bar 컨테이너

    // 섹션 관리 변수
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    let currentSectionIndex = 0;
    let isScrolling = false; // 스크롤 중복 방지 플래그

    if (startButton) {
        startButton.addEventListener('click', () => {
            introScreen.classList.add('fade-out');
            setTimeout(() => {
                introScreen.style.display = 'none';
                portfolioContent.style.display = 'block';
                
                // [추가] 게임 시작 시 EXP Bar 보이기
                if (expBarContainer) {
                    expBarContainer.style.display = 'flex';
                }

                // 메인 컨텐츠가 나타날 때 살짝 딜레이를 주어 부드럽게
                setTimeout(() => {
                    portfolioContent.classList.add('fade-in');
                    // 시작 시 첫 번째 섹션으로 확실하게 이동
                    if(sections.length > 0) {
                        sections[0].scrollIntoView({ behavior: 'auto', inline: 'start' });
                    }
                }, 50);
            }, 800);
        });
    }

    /* 2. Full Page Scroll Logic (Section by Section) */
    if (contentContainer) {
        // (1) 휠 이벤트: 섹션 단위 이동
        contentContainer.addEventListener('wheel', (evt) => {
            // 모바일이 아닐 때만 적용
            if (window.innerWidth > 900) {
                evt.preventDefault(); // 기본 스크롤 방지

                if (isScrolling) return; // 애니메이션 중이면 무시

                if (evt.deltaY > 0) {
                    // 아래로 휠 -> 다음 섹션 (오른쪽)
                    if (currentSectionIndex < sections.length - 1) {
                        changeSection(currentSectionIndex + 1);
                    }
                } else {
                    // 위로 휠 -> 이전 섹션 (왼쪽)
                    if (currentSectionIndex > 0) {
                        changeSection(currentSectionIndex - 1);
                    }
                }
            }
        }, { passive: false }); // preventDefault 사용을 위해 passive: false 설정

        // (2) 스크롤 이벤트: EXP Bar 업데이트
        contentContainer.addEventListener('scroll', () => {
            const scrollLeft = contentContainer.scrollLeft;
            const scrollWidth = contentContainer.scrollWidth - contentContainer.clientWidth;
            const scrollPercent = (scrollLeft / scrollWidth) * 100;

            if (expFill) {
                expFill.style.width = `${scrollPercent}%`;
            }
        });
    }

    // 섹션 이동 함수
    function changeSection(index) {
        isScrolling = true;
        currentSectionIndex = index;

        sections[index].scrollIntoView({
            behavior: 'smooth',
            inline: 'start', // 가로 스크롤 시작점 기준
            block: 'nearest'
        });

        // 애니메이션 시간(약 800ms) 동안 휠 이벤트 무시
        setTimeout(() => {
            isScrolling = false;
        }, 800);
    }

    /* 3. Navigation Click Handling */
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth > 900) {
                e.preventDefault(); // 기본 앵커 이동 방지
                
                const targetId = link.getAttribute('href').substring(1);
                // ID로 해당 섹션의 인덱스 찾기
                const targetIndex = Array.from(sections).findIndex(sec => sec.id === targetId);
                
                if (targetIndex !== -1) {
                    changeSection(targetIndex);
                }
            }
        });
    });

    /* 4. Scroll Reveal & Nav Active State */
    // IntersectionObserver는 네비게이션 활성화 및 애니메이션 트리거용으로 유지
    const revealElements = document.querySelectorAll('.reveal');

    const observerOptions = {
        root: contentContainer,
        threshold: 0.5 // 50% 이상 보일 때 감지
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Reveal Animation
                if (entry.target.classList.contains('reveal')) {
                    entry.target.classList.add('active');
                }

                // Nav Active State
                // 섹션인 경우에만 네비게이션 업데이트
                if (entry.target.tagName === 'SECTION') {
                    const id = entry.target.getAttribute('id');
                    if(id !== 'intro-screen') {
                        navLinks.forEach(link => {
                            link.classList.remove('active');
                            
                            const href = link.getAttribute('href');
                            
                            // [수정] 프로젝트 섹션(project-1, project-2, project-3)은 모두 'Projects' 메뉴를 활성화
                            if (id.startsWith('project-')) {
                                if (href === '#project-1') {
                                    link.classList.add('active');
                                }
                            } else {
                                // 일반 섹션 (home, about, skills, contact)
                                if (href === `#${id}`) {
                                    link.classList.add('active');
                                }
                            }
                        });
                        
                        // 현재 인덱스 동기화 (새로고침 등으로 위치가 달라졌을 경우 대비)
                        const index = Array.from(sections).findIndex(sec => sec.id === id);
                        if (index !== -1 && !isScrolling) {
                            currentSectionIndex = index;
                        }
                    }
                }
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
    sections.forEach(sec => observer.observe(sec));


    /* 5. Email Modal Logic */
    const openModalBtn = document.getElementById('open-mail-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const modalOverlay = document.getElementById('mail-modal');
    const contactForm = document.getElementById('contact-form');

    if (openModalBtn && modalOverlay) {
        openModalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modalOverlay.style.display = 'flex';
            // 약간의 딜레이 후 active 클래스 추가 (애니메이션용)
            setTimeout(() => {
                modalOverlay.classList.add('active');
            }, 10);
        });

        const closeModal = () => {
            modalOverlay.classList.remove('active');
            setTimeout(() => {
                modalOverlay.style.display = 'none';
            }, 300);
        };

        closeModalBtn.addEventListener('click', closeModal);
        
        // 배경 클릭 시 닫기
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });

        // 폼 제출 (EmailJS)
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.innerText = 'SENDING...';
            btn.disabled = true;

            // EmailJS sendForm (Service ID, Template ID, Form ID)
            // [중요] 본인의 Service ID와 Template ID로 교체해야 함
            emailjs.sendForm('service_9r8554d', 'template_p76bckc', this)
                .then(function() {
                    alert('메일이 성공적으로 전송되었습니다! 🚀');
                    btn.innerText = 'SUCCESS';
                    setTimeout(() => {
                        closeModal();
                        btn.innerText = originalText;
                        btn.disabled = false;
                        contactForm.reset();
                    }, 1000);
                }, function(error) {
                    alert('전송 실패... 다시 시도해주세요. 😢\n' + JSON.stringify(error));
                    btn.innerText = originalText;
                    btn.disabled = false;
                });
        });
    }

});

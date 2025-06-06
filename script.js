// Utils
const select = (selector, all = false, context = document) => 
    all ? [...context.querySelectorAll(selector)] : context.querySelector(selector);
  
const on = (event, selector, handler, options = {}) => {
    const { all = false, context = document } = options;
    const elements = select(selector, all, context);
    
    if (!elements || (all && elements.length === 0)) return;
    
    if (all) {
        elements.forEach(el => el.addEventListener(event, handler));
    } else {
        elements.addEventListener(event, handler);
    }
};

// Sistema de throttle
const createScrollManager = (callback, threshold = 100) => {
    let lastCall = 0;
    
    return () => {
        const now = Date.now();
        if (now - lastCall >= threshold) {
            lastCall = now;
            callback();
        }
    };
};

// Navbar scroll effect
const navbar = select('#navbar');
const updateNavbarScroll = () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
};
window.addEventListener('scroll', createScrollManager(updateNavbarScroll));

// Mobile menu
const initMobileMenu = () => {
    const menuToggle = select('.menu-toggle');
    const navbarLinks = select('.navbar-links');
    
    if (!menuToggle || !navbarLinks) return;
    
    const toggleMenu = () => {
        const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !expanded);
        navbarLinks.classList.toggle('active');
        document.body.classList.toggle('mobile-menu-active');
        
        const icon = menuToggle.querySelector('i');
        if (icon) {
            icon.classList.replace(expanded ? 'fa-times' : 'fa-bars', 
                                  expanded ? 'fa-bars' : 'fa-times');
        }
    };
    
    menuToggle.addEventListener('click', toggleMenu);
};

// Smooth scroll
const initSmoothScroll = () => {
    on('click', '.smooth-scroll', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (!targetId.startsWith('#')) return;
  
        const target = select(targetId);
        if (!target) return;
  
        const headerHeight = navbar ? navbar.offsetHeight : 0;
        const offsetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight;
  
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
  
        // Fechar menu mobile se aberto
        const navbarLinks = select('.navbar-links');
        if (navbarLinks?.classList.contains('active')) {
            navbarLinks.classList.remove('active');
            const menuToggle = select('.menu-toggle');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('mobile-menu-active');
            menuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
        }
    }, { all: true });
};

// Active link on scroll
const initActiveLinks = () => {
    const sections = select('section[id]', true);
    const navLinks = select('.nav-link', true);
    
    if (!sections.length || !navLinks.length) return;
    
    const updateActiveLink = () => {
        const navbarHeight = navbar?.offsetHeight || 70;
        const scrollPosition = window.scrollY + navbarHeight + 100;
        
        let currentSection = sections[0].id;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.id;
            }
        });
        
        navLinks.forEach(link => {
            const linkTarget = link.getAttribute('href').substring(1);
            link.classList.toggle('active-link', linkTarget === currentSection);
        });
    };
    
    window.addEventListener('scroll', createScrollManager(updateActiveLink));
    window.addEventListener('load', updateActiveLink);
};

// FAQ Accordion
const initFAQAccordion = () => {
    const faqItems = select('.faq-item', true);
    if (!faqItems.length) return;
    
    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (!question || !answer) return;
        
        // IDs únicos para acessibilidade
        const faqId = `faq-answer-${index}`;
        question.id = `faq-question-${index}`;
        question.setAttribute('aria-controls', faqId);
        question.setAttribute('aria-expanded', 'false');
        answer.setAttribute('aria-labelledby', question.id);
        answer.id = faqId;
        
        // Função para alternar
        const toggleFAQ = () => {
            const wasExpanded = question.getAttribute('aria-expanded') === 'true';
            
            // Fechar todos os outros
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherQuestion = otherItem.querySelector('.faq-question');
                    otherItem.classList.remove('active');
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    otherAnswer.style.maxHeight = null;
                }
            });
            
            // Alternar atual
            item.classList.toggle('active', !wasExpanded);
            question.setAttribute('aria-expanded', !wasExpanded);
            answer.style.maxHeight = !wasExpanded ? `${answer.scrollHeight}px` : null;
        };
        
        // Event listeners
        question.addEventListener('click', toggleFAQ);
        question.addEventListener('keydown', (e) => {
            if (['Enter', ' '].includes(e.key)) {
                e.preventDefault();
                toggleFAQ();
            }
        });
    });
};

// Botão WhatsApp
const initWhatsAppButtons = () => {
    // Número de WhatsApp (substitua pelo número correto)
    const whatsappNumber = '5511999999999';
    
    on('click', '.btn-quero', function() {
        const kitCard = this.closest('.kit-card');
        const kitName = kitCard?.querySelector('h3')?.textContent || 'Kit EcoFolhas';
        
        // Mensagem pré-formatada
        const message = `Olá! Gostaria de adquirir o ${kitName} da EcoFolhas. Por favor, me informe como prosseguir.`;
        
        // Criar link do WhatsApp
        const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        
        // Abrir em nova aba
        window.open(whatsappLink, '_blank');
        
        // Efeito ripple
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        
        const rect = this.getBoundingClientRect();
        ripple.style.left = `${event.clientX - rect.left}px`;
        ripple.style.top = `${event.clientY - rect.top}px`;
        
        this.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
        
    }, { all: true });
};

// Back to top button
const initBackToTop = () => {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.id = 'backToTop';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Voltar ao topo');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTopBtn);
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    const updateVisibility = () => {
        backToTopBtn.classList.toggle('visible', window.scrollY > 300);
    };
    
    window.addEventListener('scroll', createScrollManager(updateVisibility));
    updateVisibility();
};

// Floating leaves
const createLeaves = () => {
    const container = select('#leaves-container');
    if (!container) return;
    
    // Limitar quantidade em dispositivos móveis
    const isMobile = window.innerWidth < 768;
    const leafCount = isMobile ? 8 : 15;
    
    const icons = ['fa-leaf', 'fa-leaf', 'fa-seedling'];
    container.innerHTML = '';
    
    for (let i = 0; i < leafCount; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'leaf';
        leaf.innerHTML = `<i class="fas ${icons[Math.floor(Math.random() * icons.length)]}"></i>`;
        
        Object.assign(leaf.style, {
            '--leaf-left': `${Math.random() * 100}%`,
            '--leaf-size': `${10 + Math.random() * 20}px`,
            '--leaf-rotation': `${Math.random() * 360}deg`,
            '--leaf-delay': `${Math.random() * 5}s`,
            '--leaf-duration': `${10 + Math.random() * 15}s`,
            '--leaf-opacity': `${0.3 + Math.random() * 0.7}`
        });
        
        container.appendChild(leaf);
    }
};

// Observer para animações
const initAnimations = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { 
        threshold: 0.15
    });
    
    select('.animate-on-scroll', true).forEach(el => observer.observe(el));
};

// Observer para estatísticas
const initStatsObserver = () => {
    const stats = select('.stat-item', true);
    if (!stats.length) return;
    
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, { threshold: 0.1 });
    
    stats.forEach(el => observer.observe(el));
};

// Atualizar ano no footer
const updateFooterYear = () => {
    const yearSpan = select('#currentYear');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
};

// Carrossel
const initCarousel = () => {
    const carouselTrack = select('.carousel-track');
    const slides = select('.carousel-slide', true);
    const btnPrev = select('.carousel-btn.prev');
    const btnNext = select('.carousel-btn.next');
    
    if (!carouselTrack || !slides || !btnPrev || !btnNext) return;
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    const goToSlide = (index) => {
        if (index < 0 || index >= totalSlides) return;
        
        currentSlide = index;
        carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    };
    
    const nextSlide = () => {
        const next = currentSlide === totalSlides - 1 ? 0 : currentSlide + 1;
        goToSlide(next);
    };
    
    const prevSlide = () => {
        const prev = currentSlide === 0 ? totalSlides - 1 : currentSlide - 1;
        goToSlide(prev);
    };
    
    btnNext.addEventListener('click', nextSlide);
    btnPrev.addEventListener('click', prevSlide);
    
    // Opcional: Autoplay
    // setInterval(nextSlide, 5000);
};

// Botão "Quero experimentar na prática" rola até a seção de vídeo
const setupVideoScrollButton = () => {
    // Adicione um ID na seção de vídeo: <section id="magic-section">...</section>
    // Adicione a classe 'scroll-to-video' no botão: <button class="btn-quero scroll-to-video">
    
    on('click', '.scroll-to-video', function(e) {
        e.preventDefault();
        const target = select('#magic-section');
        if (!target) return;
        
        const headerHeight = navbar ? navbar.offsetHeight : 0;
        const offsetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }, { all: true });
};

// Ripple effect para botões
const initRippleEffects = () => {
    on('click', '.btn-quero', function(e) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        
        const rect = this.getBoundingClientRect();
        ripple.style.left = `${e.clientX - rect.left}px`;
        ripple.style.top = `${e.clientY - rect.top}px`;
        
        this.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
    }, { all: true });
};

// Inicialização completa
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initSmoothScroll();
    initActiveLinks();
    initFAQAccordion();
    initWhatsAppButtons();
    initBackToTop();
    createLeaves();
    initAnimations();
    initCarousel(); // Inicializar carrossel
    initStatsObserver(); // Inicializar observer para estatísticas
    updateFooterYear();
    initRippleEffects(); // Efeito ripple para botões
    setupVideoScrollButton(); // Configurar o botão para rolar até o vídeo
    
    // Recriar folhas ao redimensionar
    window.addEventListener('resize', createScrollManager(createLeaves));
});
document.addEventListener('DOMContentLoaded', function() {
    const video = document.querySelector('.main-video');
    const playOverlay = document.querySelector('.play-overlay');
    const playButton = document.querySelector('.play-button');
    const playPauseBtn = document.querySelector('.play-pause-btn');
    const progressBar = document.querySelector('.progress-bar');
    const progressContainer = document.querySelector('.progress-container');
    const timeDisplay = document.querySelector('.time-display');
    const fullscreenBtn = document.querySelector('.fullscreen-btn');
    const videoContainer = document.querySelector('.video-container');
  
    // Controles de reprodução
    function togglePlay() {
      if (video.paused) {
        video.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        playOverlay.style.display = 'none';
      } else {
        video.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
      }
    }
  
    playButton.addEventListener('click', function(e) {
        e.stopPropagation(); // Impede que o evento chegue ao overlay
        togglePlay();
    });
// Função para reiniciar o vídeo
function restartVideo() {
    video.currentTime = 0;
    if (video.paused) {
        video.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        playOverlay.classList.add('hidden');
    }
    
    // Animação visual
    restartBtn.classList.add('restart-animation');
    setTimeout(() => {
        restartBtn.classList.remove('restart-animation');
    }, 300);
}
    
    // Event listener para o botão de play/pause na barra
    playPauseBtn.addEventListener('click', togglePlay);
    
    // Event listener para o overlay (clique em qualquer lugar)
    playOverlay.addEventListener('click', function() {
        // Somente se o clique não foi no botão
        togglePlay();
    });
    
    // Atualizar barra de progresso
    video.addEventListener('timeupdate', function() {
        const progress = (video.currentTime / video.duration) * 100;
        progressBar.style.width = `${progress}%`;
        
        // Atualizar exibição de tempo
        const currentMins = Math.floor(video.currentTime / 60);
        const currentSecs = Math.floor(video.currentTime % 60);
        const durationMins = Math.floor(video.duration / 60);
        const durationSecs = Math.floor(video.duration % 60);
        
        timeDisplay.textContent = 
            `${currentMins}:${currentSecs < 10 ? '0' : ''}${currentSecs} / ${durationMins}:${durationSecs < 10 ? '0' : ''}${durationSecs}`;
    });
    
    // Clique na barra de progresso para buscar
    progressContainer.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const pos = (e.pageX - rect.left) / this.offsetWidth;
        video.currentTime = pos * video.duration;
    });
    
    // Tela cheia
    fullscreenBtn.addEventListener('click', function() {
        if (!document.fullscreenElement) {
            videoContainer.requestFullscreen().catch(err => {
                console.error(`Erro ao tentar entrar em tela cheia: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    });
    
    // Reiniciar overlay ao finalizar
    video.addEventListener('ended', function() {
        playOverlay.classList.remove('hidden');
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    });
    
    // Animação de scroll
    function handleScrollAnimation() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 50) {
                el.classList.add('visible');
            }
        });
    }
    
    // Rolagem suave para links
    document.querySelectorAll('.smooth-scroll').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });
    
    // Event listeners para scroll
    window.addEventListener('scroll', handleScrollAnimation);
    window.addEventListener('load', handleScrollAnimation);
});
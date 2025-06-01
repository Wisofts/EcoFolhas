// Navbar scroll effect with throttle
let lastScrollY = 0;
let ticking = false;

function updateNavbar() {
    const navbar = document.getElementById('navbar');
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    ticking = false;
}

function throttleScroll() {
    lastScrollY = window.scrollY;
    if (!ticking) {
        window.requestAnimationFrame(updateNavbar);
        ticking = true;
    }
}

window.addEventListener('scroll', throttleScroll);

// Mobile menu toggle with enhanced accessibility
const menuToggle = document.querySelector('.menu-toggle');
const navbarLinks = document.querySelector('.navbar-links');

menuToggle.addEventListener('click', function() {
    const isExpanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', !isExpanded);
    navbarLinks.classList.toggle('active');
    
    // Toggle hamburger icon
    const icon = this.querySelector('i');
    if (navbarLinks.classList.contains('active')) {
        icon.classList.replace('fa-bars', 'fa-times');
    } else {
        icon.classList.replace('fa-times', 'fa-bars');
    }
});

// Enhanced smooth scrolling with offset calculation
document.querySelectorAll('.smooth-scroll').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;
        
        const headerHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Close mobile menu if open
        navbarLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
    });
});

// Enhanced FAQ accordion with keyboard support
document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    
    // Configuração inicial ARIA
    question.setAttribute('role', 'button');
    question.setAttribute('aria-expanded', 'false');
    question.setAttribute('aria-controls', `faq-answer-${item.dataset.id}`);
    question.setAttribute('tabindex', '0');
    
    const answer = item.querySelector('.faq-answer');
    answer.setAttribute('id', `faq-answer-${item.dataset.id}`);
    
    // Click handler
    question.addEventListener('click', toggleFAQ);
    
    // Keyboard support
    question.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleFAQ.call(question);
        }
    });
    
    function toggleFAQ() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        
        // Close all other items
        document.querySelectorAll('.faq-item').forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            }
        });
        
        // Toggle current item
        item.classList.toggle('active');
        this.setAttribute('aria-expanded', (!isExpanded).toString());
    }
});
// Atualize o efeito ripple para usar a nova classe
document.querySelectorAll('.btn-quero').forEach(button => {
  button.addEventListener('click', function(e) {
      // ... código existente ...
      
      // Atualize para usar a classe .ripple-container
      const rippleContainer = this.querySelector('.ripple-container') || document.createElement('div');
      rippleContainer.classList.add('ripple-container');
      this.appendChild(rippleContainer);
      
      const ripple = document.createElement('div');
      ripple.classList.add('ripple');
      // ... posicionamento ...
      
      rippleContainer.appendChild(ripple);
  });
});

// Adicione esta função para simular o estado de loading
function simulatePurchase(button) {
  // Adiciona estado de loading
  button.classList.add('loading');
  
  // Simula processamento
  setTimeout(() => {
      button.classList.remove('loading');
      const kitName = button.closest('.kit-card').querySelector('h3').textContent;
      showNotification(`"${kitName}" adicionado ao carrinho!`);
  }, 1500);
}

// Atualize o event listener para usar a nova função
document.querySelectorAll('.btn-quero').forEach(button => {
  button.addEventListener('click', function(e) {
      // ... código do ripple ...
      simulatePurchase(this);
  });
});

// Product feature hover effect
document.querySelectorAll('.kit-features li').forEach(li => {
    li.addEventListener('mouseenter', () => {
        li.classList.add('feature-hovered');
        li.querySelector('.icon-feature').style.transform = 'scale(1.2) rotate(-5deg)';
    });
    
    li.addEventListener('mouseleave', () => {
        li.classList.remove('feature-hovered');
        li.querySelector('.icon-feature').style.transform = '';
    });
});

// Back to top button
const backToTopBtn = document.createElement('button');
backToTopBtn.id = 'backToTop';
backToTopBtn.className = 'back-to-top';
backToTopBtn.setAttribute('aria-label', 'Voltar ao topo');
backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
document.body.appendChild(backToTopBtn);

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Show/hide back to top button
window.addEventListener('scroll', () => {
    backToTopBtn.style.display = window.scrollY > 500 ? 'block' : 'none';
});

// Intersection Observer for animations
function initAnimations() {
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add specific animation if defined in data attribute
                if (entry.target.dataset.animation) {
                    entry.target.style.animation = `${entry.target.dataset.animation} 0.8s forwards`;
                }
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Form validation for contact form
function initFormValidation() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simple validation
        const nameInput = this.querySelector('input[name="name"]');
        const emailInput = this.querySelector('input[name="email"]');
        const messageInput = this.querySelector('textarea[name="message"]');
        let isValid = true;
        
        if (!nameInput.value.trim()) {
            isValid = false;
            nameInput.classList.add('invalid');
        } else {
            nameInput.classList.remove('invalid');
        }
        
        if (!validateEmail(emailInput.value)) {
            isValid = false;
            emailInput.classList.add('invalid');
        } else {
            emailInput.classList.remove('invalid');
        }
        
        if (!messageInput.value.trim()) {
            isValid = false;
            messageInput.classList.add('invalid');
        } else {
            messageInput.classList.remove('invalid');
        }
        
        if (isValid) {
            // Simulate form submission
            showNotification('Mensagem enviada com sucesso!');
            this.reset();
        } else {
            showNotification('Por favor, preencha todos os campos corretamente', 'error');
        }
    });
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initAnimations();
    
    // Setup FAQ IDs
    document.querySelectorAll('.faq-item').forEach((item, index) => {
        item.dataset.id = index;
    });
    
    // Create floating leaves
    createLeaves();
    
    // Initialize form validation
    initFormValidation();
    
    // Set current year in footer
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});

// Service Worker registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(reg => console.log('Service Worker registrado:', reg))
            .catch(err => console.log('Falha no registro:', err));
    });
}

// Offline detection
window.addEventListener('offline', () => {
    showNotification('Você está offline. Algumas funcionalidades podem não estar disponíveis.', 'warning');
});

window.addEventListener('online', () => {
    showNotification('Conexão restabelecida!', 'success');
});


        // Navbar scroll effect
        window.addEventListener('scroll', function() {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Mobile menu toggle
        const menuToggle = document.querySelector('.menu-toggle');
        const navbarLinks = document.querySelector('.navbar-links');
        
        menuToggle.addEventListener('click', function() {
            navbarLinks.classList.toggle('active');
        });

        // Smooth scrolling
        document.querySelectorAll('.smooth-scroll').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                navbarLinks.classList.remove('active');
            });
        });

        // FAQ accordion
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
            });
        });

        // Create floating leaves
        function createLeaves() {
            const container = document.getElementById('leaves-container');
            const leafCount = 15;
            
            for (let i = 0; i < leafCount; i++) {
                const leaf = document.createElement('div');
                leaf.classList.add('leaf');
                
                // Random position
                const left = Math.random() * 100;
                const top = Math.random() * 100;
                
                // Random size
                const size = 20 + Math.random() * 30;
                
                // Random rotation
                const rotation = Math.random() * 360;
                
                // Random animation delay
                const delay = Math.random() * 15;
                
                leaf.style.left = `${left}%`;
                leaf.style.top = `${top}%`;
                leaf.style.width = `${size}px`;
                leaf.style.height = `${size}px`;
                leaf.style.animationDelay = `${delay}s`;
                
                container.appendChild(leaf);
            }
        }

        // Scroll animation
        function animateOnScroll() {
            const elements = document.querySelectorAll('.animate-on-scroll');
            
            elements.forEach(element => {
                const elementPosition = element.getBoundingClientRect().top;
                const screenPosition = window.innerHeight * 0.8;
                
                if (elementPosition < screenPosition) {
                    element.classList.add('visible');
                }
            });
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            createLeaves();
            animateOnScroll();
            
            window.addEventListener('scroll', animateOnScroll);
        });
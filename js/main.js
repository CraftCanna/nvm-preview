/**
 * The New Victorian Mansion Bed & Breakfast
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ===================================
    // DOM Elements
    // ===================================
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    const backToTop = document.getElementById('backToTop');
    const contactForm = document.getElementById('contactForm');
    const galleryItems = document.querySelectorAll('.gallery__item');
    const testimonialDots = document.querySelectorAll('.testimonials__dots .dot');
    const loadMoreGallery = document.getElementById('loadMoreGallery');

    // ===================================
    // Mobile Navigation
    // ===================================
    function openMenu() {
        navMenu.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        navMenu.classList.remove('show');
        document.body.style.overflow = '';
    }

    if (navToggle) {
        navToggle.addEventListener('click', openMenu);
    }

    if (navClose) {
        navClose.addEventListener('click', closeMenu);
    }

    // Close menu when clicking a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu.classList.contains('show') &&
            !navMenu.contains(e.target) &&
            !navToggle.contains(e.target)) {
            closeMenu();
        }
    });

    // ===================================
    // Header Scroll Effect
    // ===================================
    let lastScrollY = window.scrollY;
    const scrollThreshold = 100;

    function handleScroll() {
        const currentScrollY = window.scrollY;

        // Add/remove scrolled class
        if (currentScrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Show/hide back to top button
        if (currentScrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        lastScrollY = currentScrollY;
    }

    window.addEventListener('scroll', throttle(handleScroll, 100));

    // ===================================
    // Smooth Scroll for Navigation
    // ===================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();

                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update active nav link
                navLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // ===================================
    // Active Navigation on Scroll
    // ===================================
    const sections = document.querySelectorAll('section[id]');

    function highlightNavOnScroll() {
        const scrollY = window.scrollY;
        const headerHeight = header.offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', throttle(highlightNavOnScroll, 100));

    // ===================================
    // Back to Top Button
    // ===================================
    if (backToTop) {
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ===================================
    // Contact Form Handling
    // ===================================
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            // Basic validation
            const requiredFields = ['name', 'email', 'checkin', 'checkout'];
            let isValid = true;

            requiredFields.forEach(field => {
                const input = this.querySelector(`[name="${field}"]`);
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });

            // Email validation
            const emailInput = this.querySelector('[name="email"]');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                isValid = false;
                emailInput.classList.add('error');
            }

            // Date validation
            const checkin = new Date(data.checkin);
            const checkout = new Date(data.checkout);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (checkin < today) {
                isValid = false;
                this.querySelector('[name="checkin"]').classList.add('error');
            }

            if (checkout <= checkin) {
                isValid = false;
                this.querySelector('[name="checkout"]').classList.add('error');
            }

            if (isValid) {
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;

                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;

                // Prepare booking data for API
                const bookingData = {
                    guestName: data.name,
                    email: data.email,
                    phone: data.phone || null,
                    suiteName: data.suite || 'To be confirmed',
                    checkInDate: data.checkin,
                    checkOutDate: data.checkout,
                    guestCount: data.guests || 2,
                    specialRequests: data.message || null,
                    source: 'website'
                };

                // PREVIEW MODE - Show demo message instead of API call
                if (!window.BOOKING_API_URL) {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    showNotification(
                        'This is a preview. To make a reservation, please call (651) 286-9333 or email info@newvictorianbb.com',
                        'info'
                    );
                    return;
                }

                // Send to automation API
                const API_URL = window.BOOKING_API_URL;

                fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(bookingData)
                })
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        submitBtn.textContent = 'Booking Submitted!';
                        submitBtn.style.backgroundColor = '#4CAF50';

                        setTimeout(() => {
                            this.reset();
                            submitBtn.textContent = originalText;
                            submitBtn.style.backgroundColor = '';
                            submitBtn.disabled = false;

                            showNotification(
                                `Thank you! Your booking request has been received. Confirmation #${result.confirmationNumber}. Check your email for details.`,
                                'success'
                            );
                        }, 2000);
                    } else {
                        throw new Error(result.error || 'Booking failed');
                    }
                })
                .catch(error => {
                    console.error('Booking error:', error);
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;

                    // Fallback: show message to contact directly
                    showNotification(
                        'We couldn\'t process your booking online. Please call us at (651) 321-8151 or email info@newvictorianbb.com',
                        'error'
                    );
                });
            } else {
                showNotification('Please fill in all required fields correctly.', 'error');
            }
        });

        // Remove error class on input
        contactForm.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('input', function() {
                this.classList.remove('error');
            });
        });
    }

    // ===================================
    // Testimonials Slider
    // ===================================
    let currentTestimonial = 0;
    const testimonials = document.querySelectorAll('.testimonial');

    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.style.display = i === index ? 'block' : 'none';
        });

        testimonialDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }

    // Initialize testimonials
    if (testimonials.length > 0) {
        showTestimonial(0);

        // Auto-advance testimonials
        setInterval(nextTestimonial, 6000);

        // Dot click handlers
        testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentTestimonial = index;
                showTestimonial(index);
            });
        });
    }

    // ===================================
    // Gallery Lightbox
    // ===================================
    function createLightbox() {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <span class="lightbox__close">&times;</span>
            <div class="lightbox__content">
                <img src="" alt="Gallery Image">
            </div>
        `;
        document.body.appendChild(lightbox);

        const lightboxClose = lightbox.querySelector('.lightbox__close');
        const lightboxImg = lightbox.querySelector('img');

        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('active') && e.key === 'Escape') {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        return { lightbox, lightboxImg };
    }

    const { lightbox, lightboxImg } = createLightbox();

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // ===================================
    // Load More Gallery
    // ===================================
    if (loadMoreGallery) {
        const additionalImages = [
            { src: 'images/nvm-19.jpg', alt: 'Room Detail' },
            { src: 'images/nvm-31.jpg', alt: 'Suite Interior' },
            { src: 'images/nvm-32.jpg', alt: 'Common Area' },
            { src: 'images/nvm-33.jpg', alt: 'Dining Space' },
            { src: 'images/nvm-34.jpg', alt: 'Garden View' },
            { src: 'images/nvm-66.jpg', alt: 'Exterior View' },
            { src: 'images/nvm-67.jpg', alt: 'Architecture Detail' },
            { src: 'images/nvm-36.jpg', alt: 'Interior Detail' }
        ];

        let loaded = false;

        loadMoreGallery.addEventListener('click', function() {
            if (loaded) return;

            const galleryGrid = document.querySelector('.gallery__grid');

            additionalImages.forEach((image, index) => {
                const item = document.createElement('div');
                item.className = 'gallery__item';
                if (index === 0 || index === 7) {
                    item.classList.add('gallery__item--wide');
                }
                item.innerHTML = `<img src="${image.src}" alt="${image.alt}" loading="lazy">`;

                // Add click handler for lightbox
                item.addEventListener('click', () => {
                    lightboxImg.src = image.src;
                    lightboxImg.alt = image.alt;
                    lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden';
                });

                galleryGrid.appendChild(item);
            });

            this.textContent = 'All Photos Loaded';
            this.disabled = true;
            this.style.opacity = '0.6';
            loaded = true;
        });
    }

    // ===================================
    // Scroll Animations
    // ===================================
    const animateElements = document.querySelectorAll('.suite-card, .amenity, .feature, .service');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });

    // ===================================
    // Date Input Min Date
    // ===================================
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');

    if (checkinInput && checkoutInput) {
        const today = new Date().toISOString().split('T')[0];
        checkinInput.min = today;
        checkoutInput.min = today;

        checkinInput.addEventListener('change', function() {
            const checkinDate = new Date(this.value);
            checkinDate.setDate(checkinDate.getDate() + 1);
            checkoutInput.min = checkinDate.toISOString().split('T')[0];

            if (new Date(checkoutInput.value) <= new Date(this.value)) {
                checkoutInput.value = '';
            }
        });
    }

    // ===================================
    // Utility Functions
    // ===================================
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existing = document.querySelector('.notification');
        if (existing) {
            existing.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification__close">&times;</button>
        `;

        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            backgroundColor: type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3',
            color: 'white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            zIndex: '9999',
            animation: 'slideIn 0.3s ease'
        });

        document.body.appendChild(notification);

        // Close button
        notification.querySelector('.notification__close').addEventListener('click', () => {
            notification.remove();
        });

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // Add notification animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        .form-group input.error,
        .form-group select.error,
        .form-group textarea.error {
            border-color: #f44336 !important;
        }
        .notification__close {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            line-height: 1;
        }
    `;
    document.head.appendChild(style);

    // ===================================
    // Newsletter Form
    // ===================================
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;

            if (email) {
                showNotification('Thank you for subscribing!', 'success');
                this.reset();
            }
        });
    }

    // ===================================
    // Preload Critical Images
    // ===================================
    function preloadImage(src) {
        const img = new Image();
        img.src = src;
    }

    // Preload hero image
    preloadImage('images/nvm-01.jpg');

    // ===================================
    // Initialize
    // ===================================
    handleScroll();
    highlightNavOnScroll();

    // Update copyright year
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    console.log('The New Victorian Mansion B&B - Website Initialized');
});

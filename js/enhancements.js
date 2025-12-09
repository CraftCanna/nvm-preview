/**
 * The New Victorian Mansion Bed & Breakfast
 * Enhancement JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ===================================
    // Sticky Book Now Button
    // ===================================
    const stickyBookBtn = document.querySelector('.sticky-book-btn');
    const contactSection = document.getElementById('contact');

    function handleStickyButton() {
        if (!stickyBookBtn || !contactSection) return;

        const scrollY = window.scrollY;
        const contactTop = contactSection.offsetTop;
        const windowHeight = window.innerHeight;

        // Show after scrolling past hero, hide when contact section is visible
        if (scrollY > 600 && scrollY < contactTop - windowHeight) {
            stickyBookBtn.classList.add('visible');
        } else {
            stickyBookBtn.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', throttle(handleStickyButton, 100));

    // ===================================
    // Enhanced Lightbox Gallery
    // ===================================
    function initEnhancedLightbox() {
        const galleryItems = document.querySelectorAll('.gallery__item');
        if (galleryItems.length === 0) return;

        // Collect all gallery images
        const galleryImages = [];
        galleryItems.forEach(item => {
            const img = item.querySelector('img');
            if (img) {
                galleryImages.push({
                    src: img.src,
                    alt: img.alt
                });
            }
        });

        let currentIndex = 0;

        // Create enhanced lightbox
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <span class="lightbox__close" aria-label="Close gallery">&times;</span>
            <button class="lightbox__nav lightbox__nav--prev" aria-label="Previous image">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15 18 9 12 15 6"/>
                </svg>
            </button>
            <div class="lightbox__content">
                <img src="" alt="">
            </div>
            <button class="lightbox__nav lightbox__nav--next" aria-label="Next image">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"/>
                </svg>
            </button>
            <div class="lightbox__counter"></div>
        `;
        document.body.appendChild(lightbox);

        const lightboxImg = lightbox.querySelector('img');
        const lightboxCounter = lightbox.querySelector('.lightbox__counter');
        const prevBtn = lightbox.querySelector('.lightbox__nav--prev');
        const nextBtn = lightbox.querySelector('.lightbox__nav--next');
        const closeBtn = lightbox.querySelector('.lightbox__close');

        function showImage(index) {
            currentIndex = index;
            lightboxImg.src = galleryImages[index].src;
            lightboxImg.alt = galleryImages[index].alt;
            lightboxCounter.textContent = `${index + 1} / ${galleryImages.length}`;
        }

        function openLightbox(index) {
            showImage(index);
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        function nextImage() {
            showImage((currentIndex + 1) % galleryImages.length);
        }

        function prevImage() {
            showImage((currentIndex - 1 + galleryImages.length) % galleryImages.length);
        }

        // Event listeners
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));
        });

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', prevImage);
        nextBtn.addEventListener('click', nextImage);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        });

        // Touch swipe support
        let touchStartX = 0;
        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        lightbox.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) nextImage();
                else prevImage();
            }
        });
    }

    // Only init if not already handled by main.js
    if (!document.querySelector('.lightbox')) {
        initEnhancedLightbox();
    }

    // ===================================
    // FAQ Accordion
    // ===================================
    const faqItems = document.querySelectorAll('.faq__item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq__question');

        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // ===================================
    // Booking Wizard
    // ===================================
    const bookingWizard = document.querySelector('.booking-wizard');

    if (bookingWizard) {
        const steps = bookingWizard.querySelectorAll('.booking-step');
        const panels = bookingWizard.querySelectorAll('.booking-wizard__panel');
        const nextBtns = bookingWizard.querySelectorAll('[data-action="next"]');
        const prevBtns = bookingWizard.querySelectorAll('[data-action="prev"]');
        let currentStep = 0;

        function goToStep(stepIndex) {
            // Update step indicators
            steps.forEach((step, i) => {
                step.classList.remove('active', 'completed');
                if (i < stepIndex) step.classList.add('completed');
                if (i === stepIndex) step.classList.add('active');
            });

            // Update panels
            panels.forEach((panel, i) => {
                panel.classList.toggle('active', i === stepIndex);
            });

            currentStep = stepIndex;
        }

        nextBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (currentStep < steps.length - 1) {
                    goToStep(currentStep + 1);
                }
            });
        });

        prevBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (currentStep > 0) {
                    goToStep(currentStep - 1);
                }
            });
        });

        // Suite selection cards
        const suiteCards = bookingWizard.querySelectorAll('.suite-select-card');
        suiteCards.forEach(card => {
            card.addEventListener('click', () => {
                suiteCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                card.querySelector('input').checked = true;
            });
        });

        // Enhancement options
        const enhancementOptions = bookingWizard.querySelectorAll('.enhancement-option');
        enhancementOptions.forEach(option => {
            option.addEventListener('click', () => {
                const checkbox = option.querySelector('input[type="checkbox"]');
                checkbox.checked = !checkbox.checked;
                option.classList.toggle('selected', checkbox.checked);
            });
        });
    }

    // ===================================
    // Availability Calendar
    // ===================================
    function initAvailabilityCalendar() {
        const calendarContainer = document.getElementById('availability-calendar');
        if (!calendarContainer) return;

        const currentDate = new Date();
        let displayMonth = currentDate.getMonth();
        let displayYear = currentDate.getFullYear();

        // Mock availability data (in production, this would come from API)
        const availabilityData = generateMockAvailability();

        function generateMockAvailability() {
            const data = {};
            const today = new Date();

            for (let i = 0; i < 90; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() + i);
                const dateStr = date.toISOString().split('T')[0];

                // Random availability (70% available, 20% limited, 10% booked)
                const rand = Math.random();
                if (rand < 0.1) data[dateStr] = 'booked';
                else if (rand < 0.3) data[dateStr] = 'limited';
                else data[dateStr] = 'available';
            }

            return data;
        }

        function renderCalendar() {
            const firstDay = new Date(displayYear, displayMonth, 1);
            const lastDay = new Date(displayYear, displayMonth + 1, 0);
            const startDay = firstDay.getDay();
            const totalDays = lastDay.getDate();

            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                              'July', 'August', 'September', 'October', 'November', 'December'];

            let html = `
                <div class="calendar__header">
                    <button class="calendar__nav" data-direction="prev" aria-label="Previous month">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="15 18 9 12 15 6"/>
                        </svg>
                    </button>
                    <h4 class="calendar__title">${monthNames[displayMonth]} ${displayYear}</h4>
                    <button class="calendar__nav" data-direction="next" aria-label="Next month">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="9 18 15 12 9 6"/>
                        </svg>
                    </button>
                </div>
                <div class="calendar__weekdays">
                    <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                </div>
                <div class="calendar__days">
            `;

            // Empty cells for days before month starts
            for (let i = 0; i < startDay; i++) {
                html += '<span class="calendar__day calendar__day--empty"></span>';
            }

            // Days of the month
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            for (let day = 1; day <= totalDays; day++) {
                const date = new Date(displayYear, displayMonth, day);
                const dateStr = date.toISOString().split('T')[0];
                const isPast = date < today;
                const availability = availabilityData[dateStr] || 'available';

                let classes = 'calendar__day';
                if (isPast) classes += ' calendar__day--past';
                else classes += ` calendar__day--${availability}`;

                html += `<span class="${classes}" data-date="${dateStr}">${day}</span>`;
            }

            html += '</div>';
            html += `
                <div class="calendar__legend">
                    <span class="legend-item"><span class="legend-dot legend-dot--available"></span> Available</span>
                    <span class="legend-item"><span class="legend-dot legend-dot--limited"></span> Limited</span>
                    <span class="legend-item"><span class="legend-dot legend-dot--booked"></span> Booked</span>
                </div>
            `;

            calendarContainer.innerHTML = html;

            // Add navigation handlers
            calendarContainer.querySelector('[data-direction="prev"]').addEventListener('click', () => {
                displayMonth--;
                if (displayMonth < 0) {
                    displayMonth = 11;
                    displayYear--;
                }
                renderCalendar();
            });

            calendarContainer.querySelector('[data-direction="next"]').addEventListener('click', () => {
                displayMonth++;
                if (displayMonth > 11) {
                    displayMonth = 0;
                    displayYear++;
                }
                renderCalendar();
            });

            // Day click handler
            calendarContainer.querySelectorAll('.calendar__day:not(.calendar__day--past):not(.calendar__day--empty):not(.calendar__day--booked)').forEach(day => {
                day.addEventListener('click', () => {
                    const checkinInput = document.getElementById('checkin');
                    if (checkinInput) {
                        checkinInput.value = day.dataset.date;
                        checkinInput.dispatchEvent(new Event('change'));
                    }
                });
            });
        }

        renderCalendar();
    }

    initAvailabilityCalendar();

    // ===================================
    // Scroll Reveal Animations
    // ===================================
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger-children');

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach(el => revealObserver.observe(el));
    }

    initScrollReveal();

    // ===================================
    // Lazy Image Loading
    // ===================================
    function initLazyImages() {
        const lazyImages = document.querySelectorAll('img[data-src]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.onload = () => {
                            img.classList.add('loaded');
                            img.removeAttribute('data-src');
                        };
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '100px'
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
            });
        }
    }

    initLazyImages();

    // ===================================
    // Parallax Effect
    // ===================================
    function initParallax() {
        const parallaxElements = document.querySelectorAll('.parallax-bg');

        if (parallaxElements.length === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        function updateParallax() {
            const scrollY = window.scrollY;

            parallaxElements.forEach(el => {
                const rect = el.parentElement.getBoundingClientRect();
                const inView = rect.top < window.innerHeight && rect.bottom > 0;

                if (inView) {
                    const speed = 0.3;
                    const yPos = (scrollY - el.parentElement.offsetTop) * speed;
                    el.style.transform = `translateY(${yPos}px)`;
                }
            });
        }

        window.addEventListener('scroll', throttle(updateParallax, 16));
    }

    initParallax();

    // ===================================
    // Enhanced Testimonials with Touch Support
    // ===================================
    function initEnhancedTestimonials() {
        const slider = document.querySelector('.testimonials__slider');
        if (!slider) return;

        let touchStartX = 0;
        let touchEndX = 0;

        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        slider.addEventListener('touchmove', (e) => {
            touchEndX = e.touches[0].clientX;
        }, { passive: true });

        slider.addEventListener('touchend', () => {
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                // Trigger next/prev testimonial
                const dots = document.querySelectorAll('.testimonials__dots .dot');
                const currentDot = document.querySelector('.testimonials__dots .dot.active');
                const currentIndex = Array.from(dots).indexOf(currentDot);

                let newIndex;
                if (diff > 0) {
                    // Swipe left - next
                    newIndex = (currentIndex + 1) % dots.length;
                } else {
                    // Swipe right - prev
                    newIndex = (currentIndex - 1 + dots.length) % dots.length;
                }

                dots[newIndex].click();
            }
        });
    }

    initEnhancedTestimonials();

    // ===================================
    // Gift Certificate Amount Selection
    // ===================================
    const giftOptions = document.querySelectorAll('.gift-option');
    giftOptions.forEach(option => {
        option.addEventListener('click', () => {
            giftOptions.forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');

            // Could trigger a modal or redirect to payment
            const amount = option.querySelector('.gift-option__amount').textContent;
            console.log(`Selected gift certificate: ${amount}`);
        });
    });

    // ===================================
    // Neighborhood Guide Tabs (for Things to Do page)
    // ===================================
    const tabButtons = document.querySelectorAll('[data-tab-target]');
    const tabPanels = document.querySelectorAll('[data-tab-content]');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.tabTarget;

            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));

            button.classList.add('active');
            document.querySelector(`[data-tab-content="${targetId}"]`)?.classList.add('active');
        });
    });

    // ===================================
    // Form Enhancements
    // ===================================
    // Phone number formatting
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 6) {
                value = `(${value.slice(0,3)}) ${value.slice(3,6)}-${value.slice(6,10)}`;
            } else if (value.length >= 3) {
                value = `(${value.slice(0,3)}) ${value.slice(3)}`;
            }
            e.target.value = value;
        });
    });

    // Real-time form validation
    const formInputs = document.querySelectorAll('.contact__form input, .contact__form textarea, .contact__form select');
    formInputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateInput(input);
        });
    });

    function validateInput(input) {
        const value = input.value.trim();

        if (input.required && !value) {
            input.classList.add('error');
            return false;
        }

        if (input.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                input.classList.add('error');
                return false;
            }
        }

        input.classList.remove('error');
        return true;
    }

    // ===================================
    // Booking Summary Calculator
    // ===================================
    function updateBookingSummary() {
        const checkin = document.getElementById('checkin')?.value;
        const checkout = document.getElementById('checkout')?.value;
        const summaryEl = document.getElementById('booking-summary');

        if (!checkin || !checkout || !summaryEl) return;

        const checkinDate = new Date(checkin);
        const checkoutDate = new Date(checkout);
        const nights = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));

        if (nights > 0) {
            const baseRate = 199; // Example base rate
            const total = nights * baseRate;

            summaryEl.innerHTML = `
                <div class="booking-summary">
                    <div class="booking-summary__row">
                        <span>${nights} night${nights > 1 ? 's' : ''}</span>
                        <span>$${total}</span>
                    </div>
                    <div class="booking-summary__row booking-summary__total">
                        <strong>Estimated Total</strong>
                        <strong>$${total}</strong>
                    </div>
                </div>
            `;
        }
    }

    document.getElementById('checkin')?.addEventListener('change', updateBookingSummary);
    document.getElementById('checkout')?.addEventListener('change', updateBookingSummary);

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

    // ===================================
    // Interactive History Timeline
    // ===================================
    function initInteractiveTimeline() {
        const timelinePoints = document.querySelectorAll('.timeline-point');
        const timelineCards = document.querySelectorAll('.timeline-card');
        const timelineDots = document.querySelectorAll('.timeline-dot');
        const prevBtn = document.querySelector('.timeline-arrow--prev');
        const nextBtn = document.querySelector('.timeline-arrow--next');

        if (timelinePoints.length === 0) return;

        let currentIndex = 0;
        const maxIndex = timelinePoints.length - 1;

        function updateTimeline(index) {
            // Update current index
            currentIndex = index;

            // Update timeline points
            timelinePoints.forEach((point, i) => {
                point.classList.toggle('active', i === index);
            });

            // Update timeline cards
            timelineCards.forEach((card, i) => {
                card.classList.toggle('active', i === index);
            });

            // Update progress dots
            timelineDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });

            // Update arrow buttons
            if (prevBtn) prevBtn.disabled = index === 0;
            if (nextBtn) nextBtn.disabled = index === maxIndex;

            // Scroll the timeline nav to keep active point visible on mobile
            const activePoint = timelinePoints[index];
            if (activePoint) {
                activePoint.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            }
        }

        // Click handlers for timeline points
        timelinePoints.forEach((point, index) => {
            point.addEventListener('click', () => updateTimeline(index));
        });

        // Click handlers for progress dots
        timelineDots.forEach((dot, index) => {
            dot.addEventListener('click', () => updateTimeline(index));
        });

        // Arrow button handlers
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    updateTimeline(currentIndex - 1);
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (currentIndex < maxIndex) {
                    updateTimeline(currentIndex + 1);
                }
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            const timeline = document.querySelector('.interactive-timeline');
            if (!timeline) return;

            // Check if timeline is in viewport
            const rect = timeline.getBoundingClientRect();
            const inViewport = rect.top < window.innerHeight && rect.bottom > 0;

            if (inViewport) {
                if (e.key === 'ArrowLeft' && currentIndex > 0) {
                    updateTimeline(currentIndex - 1);
                } else if (e.key === 'ArrowRight' && currentIndex < maxIndex) {
                    updateTimeline(currentIndex + 1);
                }
            }
        });

        // Auto-advance option (disabled by default)
        let autoAdvance = false;
        let autoAdvanceInterval;

        function startAutoAdvance() {
            autoAdvanceInterval = setInterval(() => {
                if (currentIndex < maxIndex) {
                    updateTimeline(currentIndex + 1);
                } else {
                    updateTimeline(0); // Loop back to start
                }
            }, 5000);
        }

        function stopAutoAdvance() {
            clearInterval(autoAdvanceInterval);
        }

        // Stop auto-advance on user interaction
        const timeline = document.querySelector('.interactive-timeline');
        if (timeline && autoAdvance) {
            startAutoAdvance();
            timeline.addEventListener('click', stopAutoAdvance);
            timeline.addEventListener('touchstart', stopAutoAdvance);
        }
    }

    // Initialize interactive timeline
    initInteractiveTimeline();

    // ===================================
    // Historical Dissertation Toggle
    // ===================================
    function initDissertationToggle() {
        const toggleBtn = document.getElementById('dissertationToggle');
        const content = document.getElementById('dissertationContent');

        if (!toggleBtn || !content) return;

        toggleBtn.addEventListener('click', () => {
            const isExpanded = content.classList.contains('expanded');

            content.classList.toggle('expanded');
            toggleBtn.classList.toggle('expanded');
            toggleBtn.setAttribute('aria-expanded', !isExpanded);

            // Update button text
            const btnText = toggleBtn.querySelector('span');
            if (btnText) {
                btnText.textContent = isExpanded ? 'Read Full Historical Account' : 'Close Historical Account';
            }

            // Scroll to content if expanding
            if (!isExpanded) {
                setTimeout(() => {
                    content.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 100);
            }
        });
    }

    // Initialize dissertation toggle
    initDissertationToggle();

    // ===================================
    // Initialize
    // ===================================
    handleStickyButton();

    console.log('The New Victorian Mansion B&B - Enhancements Initialized');
});

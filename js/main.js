/**
 * Simon Gløtvold Tjenester - Main JavaScript
 * Professional Electrical Services Website
 */

(function() {
    'use strict';

    // DOM Elements
    const header = document.getElementById('header');
    const nav = document.getElementById('nav');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const contactForm = document.getElementById('contact-form');

    /**
     * Mobile Menu Toggle
     */
    function initMobileMenu() {
        if (!mobileMenuToggle || !nav) return;

        mobileMenuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';

            // Toggle menu state
            this.setAttribute('aria-expanded', !isExpanded);
            this.classList.toggle('active');
            nav.classList.toggle('nav--mobile-open');

            // Update aria-label
            this.setAttribute('aria-label', isExpanded ? 'Åpne meny' : 'Lukk meny');

            // Prevent body scroll when menu is open
            document.body.style.overflow = isExpanded ? '' : 'hidden';
        });

        // Close menu when clicking on a nav link
        const navLinks = nav.querySelectorAll('.nav__link');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                mobileMenuToggle.classList.remove('active');
                nav.classList.remove('nav--mobile-open');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (nav.classList.contains('nav--mobile-open') &&
                !nav.contains(e.target) &&
                !mobileMenuToggle.contains(e.target)) {
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                mobileMenuToggle.classList.remove('active');
                nav.classList.remove('nav--mobile-open');
                document.body.style.overflow = '';
            }
        });
    }

    /**
     * Header Scroll Effect
     */
    function initHeaderScroll() {
        if (!header) return;

        let lastScroll = 0;
        const scrollThreshold = 100;

        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            // Add shadow when scrolled
            if (currentScroll > 10) {
                header.classList.add('header--scrolled');
            } else {
                header.classList.remove('header--scrolled');
            }

            lastScroll = currentScroll;
        }, { passive: true });
    }

    /**
     * Smooth Scroll for Anchor Links
     */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');

                // Skip if it's just "#"
                if (targetId === '#') return;

                const target = document.querySelector(targetId);

                if (target) {
                    e.preventDefault();

                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * Contact Form Handling
     */
    function initContactForm() {
        if (!contactForm) return;

        const successMessage = document.getElementById('form-message-success');
        const errorMessage = document.getElementById('form-message-error');

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Hide any existing messages
            if (successMessage) successMessage.classList.remove('show');
            if (errorMessage) errorMessage.classList.remove('show');

            // Get form data
            const formData = {
                name: contactForm.querySelector('#name').value,
                email: contactForm.querySelector('#email').value,
                phone: contactForm.querySelector('#phone').value,
                address: contactForm.querySelector('#address').value,
                jobType: contactForm.querySelector('#job-type').value,
                description: contactForm.querySelector('#description').value,
                siteVisit: contactForm.querySelector('#site-visit').checked ? 'Ja' : 'Nei'
            };

            // Validate required fields
            if (!formData.name || !formData.email || !formData.phone || !formData.jobType || !formData.description) {
                if (errorMessage) {
                    errorMessage.innerHTML = '<strong>Vennligst fyll ut alle påkrevde felt.</strong>';
                    errorMessage.classList.add('show');
                }
                return;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                if (errorMessage) {
                    errorMessage.innerHTML = '<strong>Vennligst oppgi en gyldig e-postadresse.</strong>';
                    errorMessage.classList.add('show');
                }
                return;
            }

            // Get submit button and show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = '<span>Sender...</span>';
            submitButton.disabled = true;

            try {
                // For demo purposes, simulate form submission
                // In production, this would send to Resend API or similar
                await simulateFormSubmission(formData);

                // Show success message
                if (successMessage) {
                    successMessage.classList.add('show');
                }

                // Reset form
                contactForm.reset();

                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

            } catch (error) {
                console.error('Form submission error:', error);

                // Show error message
                if (errorMessage) {
                    errorMessage.innerHTML = '<strong>Noe gikk galt.</strong><br>Vennligst prøv igjen eller kontakt oss direkte på telefon.';
                    errorMessage.classList.add('show');
                }
            } finally {
                // Restore button state
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            }
        });
    }

    /**
     * Simulate form submission (for demo purposes)
     * In production, replace with actual API call to Resend or similar service
     */
    function simulateFormSubmission(formData) {
        return new Promise(function(resolve, reject) {
            // Simulate network delay
            setTimeout(function() {
                // Log form data for debugging
                console.log('Form submitted with data:', formData);

                // Simulate success (90% of the time)
                if (Math.random() > 0.1) {
                    resolve({ success: true });
                } else {
                    reject(new Error('Simulated network error'));
                }
            }, 1500);
        });
    }

    /**
     * Lazy Load Images
     */
    function initLazyLoading() {
        // Check if native lazy loading is supported
        if ('loading' in HTMLImageElement.prototype) {
            // Native lazy loading is supported
            const images = document.querySelectorAll('img[loading="lazy"]');
            images.forEach(function(img) {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
            });
        } else {
            // Fallback for browsers that don't support native lazy loading
            const lazyImages = document.querySelectorAll('img[loading="lazy"]');

            const imageObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                        }
                        img.removeAttribute('loading');
                        observer.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(function(img) {
                imageObserver.observe(img);
            });
        }
    }

    /**
     * Add fade-in animation to elements when they come into view
     */
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.service-card, .value-card, .why-us__item');

        if (!animatedElements.length) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(function(el) {
            el.style.opacity = '0';
            observer.observe(el);
        });
    }

    /**
     * Phone number click tracking (for analytics)
     */
    function initPhoneTracking() {
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');

        phoneLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                // Log phone click for analytics
                if (typeof gtag === 'function') {
                    gtag('event', 'click', {
                        'event_category': 'Contact',
                        'event_label': 'Phone Call',
                        'value': 1
                    });
                }
                console.log('Phone link clicked');
            });
        });
    }

    /**
     * Email click tracking (for analytics)
     */
    function initEmailTracking() {
        const emailLinks = document.querySelectorAll('a[href^="mailto:"]');

        emailLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                // Log email click for analytics
                if (typeof gtag === 'function') {
                    gtag('event', 'click', {
                        'event_category': 'Contact',
                        'event_label': 'Email',
                        'value': 1
                    });
                }
                console.log('Email link clicked');
            });
        });
    }

    /**
     * Service Worker Registration (for offline support - future enhancement)
     */
    function initServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
                // Service worker can be added here for offline support
                // navigator.serviceWorker.register('/sw.js');
            });
        }
    }

    /**
     * Initialize all functions when DOM is ready
     */
    function init() {
        initMobileMenu();
        initHeaderScroll();
        initSmoothScroll();
        initContactForm();
        initLazyLoading();
        initScrollAnimations();
        initPhoneTracking();
        initEmailTracking();
        initServiceWorker();
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li a');

    // Toggle Mobile Menu
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // Optional: Animate hamburger icon (switch from bars to times)
        const icon = hamburger.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when a link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = hamburger.querySelector('i');
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        });
    });

    // Optional: Add smooth scroll for anchor links (if browser doesn't support scroll-behavior: smooth)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement){
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
});

/* ===== Global Scroll Animation Observer (Task 3) ===== */
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Check for reduced motion preference
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
        // If reduced motion is on, show everything immediately
        document.querySelectorAll('.animate-on-scroll').forEach(el => el.classList.add('in-view'));
        return;
    }

    // 2. Setup Intersection Observer
    const observerOptions = {
        threshold: 0.15, // Trigger when 15% of element is visible
        rootMargin: "0px 0px -10% 0px" // Offset slightly so it triggers before bottom of screen
    };

    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                
                // Get delay from HTML (e.g., data-anim-delay="100") or default to 0
                const delay = parseInt(el.getAttribute('data-anim-delay') || '0', 10);
                
                // Apply the visible class after the specified delay
                setTimeout(() => {
                    el.classList.add('in-view');
                }, delay);

                // Stop observing this element (runs only once per session)
                observerInstance.unobserve(el);
            }
        });
    }, observerOptions);

    // 3. Target ALL elements with class .animate-on-scroll across the entire page
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));
});

/* ===== Navbar Active State & Scroll Spy ===== */
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links li a');

    // 1. Click Handler: Set active class immediately on click
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 2. Scroll Spy: Detect which section is in view
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Trigger when scroll is 1/3 down the section
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
});

/* ===== Dark/Light Theme Toggle ===== */
document.addEventListener('DOMContentLoaded', () => {
    const toggleSwitch = document.querySelector('#theme-toggle');
    const body = document.body;

    // 1. Check LocalStorage for saved theme
    const savedTheme = localStorage.getItem('portfolio-theme');
    
    if (savedTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        toggleSwitch.checked = true;
    }

    // 2. Event Listener for Switch
    toggleSwitch.addEventListener('change', function(e) {
        if (e.target.checked) {
            // Switch to Dark
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('portfolio-theme', 'dark');
        } else {
            // Switch to Light
            body.removeAttribute('data-theme');
            localStorage.setItem('portfolio-theme', 'light');
        }
    });
});

/* ===== Testimonials Slider & Data Logic ===== */
document.addEventListener('DOMContentLoaded', () => {
    
    // --- Data Management ---
    const STORAGE_KEY = 'portfolio_testimonials';
    
    // Default data if nothing is saved yet
    const defaultData = [
        {
            id: 2,
            name: "John Doe",
            role: "Project Manager",
            email: "john@example.com",
            message: "I loved working with him. The project was delivered on time and exceeded expectations.",
            rating: 5,
            image: null // No image example
        }
    ];

    // Load data
    let testimonials = JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultData;

    // --- DOM Elements ---
    const sliderTrack = document.getElementById('sliderTrack');
    const form = document.getElementById('testimonialForm');
    const photoInput = document.getElementById('photoInput');
    const starInputs = document.querySelectorAll('.star-rating-input i');
    const ratingValueInput = document.getElementById('ratingValue');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const fileNameDisplay = document.getElementById('fileName');

    let currentIndex = 0;
    let autoSlideInterval;

    // --- 1. RENDER SLIDES ---
    function renderSlides() {
        sliderTrack.innerHTML = ''; // Clear current
        
        if (testimonials.length === 0) {
            sliderTrack.innerHTML = '<div class="testimonial-slide"><p>No testimonials yet.</p></div>';
            return;
        }

        testimonials.forEach(t => {
            // Determine Image HTML (Upload vs Default Icon)
            let imageHTML = '';
            if (t.image) {
                imageHTML = `<img src="${t.image}" class="slide-avatar" alt="${t.name}">`;
            } else {
                imageHTML = `<i class="fa-solid fa-user default-avatar-icon"></i>`;
            }

            // Generate Stars HTML
            let starsHTML = '';
            for(let i=1; i<=5; i++) {
                starsHTML += `<i class="${i <= t.rating ? 'fa-solid' : 'fa-regular'} fa-star"></i>`;
            }

            const slide = document.createElement('div');
            slide.classList.add('testimonial-slide');
            slide.innerHTML = `
                <button class="delete-btn" onclick="deleteTestimonial(${t.id})"><i class="fa-solid fa-trash"></i></button>
                <div class="slide-avatar-wrapper">${imageHTML}</div>
                <h3 class="slide-name">${t.name}</h3>
                <p class="slide-role">${t.role}</p>
                
                <!-- NEW: Email Displayed Here -->
                <p class="slide-email">${t.email || ''}</p> 

                <div class="slide-message">
                    <i class="fa-solid fa-quote-left quote-mark"></i>
                    ${t.message}
                    <i class="fa-solid fa-quote-right quote-mark"></i>
                </div>
                <div class="slide-rating">${starsHTML}</div>
            `;
            sliderTrack.appendChild(slide);
        });

        updateSliderPosition();
    }

    // --- 2. SLIDER LOGIC ---
    function updateSliderPosition() {
        sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % testimonials.length;
        updateSliderPosition();
        resetAutoSlide();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
        updateSliderPosition();
        resetAutoSlide();
    }

    // Auto Slide Logic
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 10000); // 10 Seconds
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    // Events
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // --- 3. FORM SUBMISSION ---
    // Handle Star Selection
    starInputs.forEach(star => {
        star.addEventListener('click', function() {
            const val = this.getAttribute('data-value');
            ratingValueInput.value = val;
            
            starInputs.forEach(s => {
                if(s.getAttribute('data-value') <= val) {
                    s.classList.remove('fa-regular');
                    s.classList.add('fa-solid', 'active-star');
                    s.style.color = '#ffb400';
                } else {
                    s.classList.remove('fa-solid', 'active-star');
                    s.classList.add('fa-regular');
                    s.style.color = '#ccc';
                }
            });
        });
    });

    // Handle File Name Display
    photoInput.addEventListener('change', function() {
        if(this.files && this.files[0]) {
            fileNameDisplay.textContent = this.files[0].name;
        }
    });

    // Handle Submit
    // ... inside form.addEventListener ...
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('nameInput').value;
        const role = document.getElementById('roleInput').value;
        
        // NEW: Get Email Value
        const email = document.getElementById('emailInput').value; 
        
        const message = document.getElementById('reviewInput').value;
        const rating = ratingValueInput.value;
        const file = photoInput.files[0];

        // Helper to finalize submission
        const addTestimonial = (imgSrc) => {
            const newTestimonial = {
                id: Date.now(),
                name,
                role,
                email, // NEW: Save Email
                message,
                rating,
                image: imgSrc
            };

            testimonials.push(newTestimonial);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(testimonials));
            
            // Reset Form
            form.reset();
            fileNameDisplay.textContent = "";
            
            // Go to new slide
            currentIndex = testimonials.length - 1;
            renderSlides();
            alert("Thank you! Your feedback has been posted.");
        };

        // Handle Image Conversion (Base64)
        if (file) {
            const reader = new FileReader();
            reader.onloadend = function() {
                addTestimonial(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            addTestimonial(null); // No image
        }
    });

    // --- 4. EXPOSE DELETE FUNCTION ---
    // Make delete function available globally so onclick="" works in HTML
    window.deleteTestimonial = function(id) {
        if(confirm("Are you sure you want to delete this comment?")) {
            testimonials = testimonials.filter(t => t.id !== id);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(testimonials));
            
            if(currentIndex >= testimonials.length) currentIndex = 0;
            renderSlides();
        }
    };

    // Initialize
    renderSlides();
    startAutoSlide();
});

/* ===== Contact Form EmailJS Integration ===== */
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Initialize EmailJS
    // REPLACE 'YOUR_PUBLIC_KEY' with your actual Public Key from EmailJS Account
    emailjs.init("");

    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const statusTxt = document.getElementById('formStatus');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Change button text to indicate loading
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;

        // 2. Send Form
        // REPLACE 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with actual values
        emailjs.sendForm('', '', this)
            .then(() => {
                // Success
                submitBtn.innerHTML = 'Message Sent! <i class="fa-solid fa-check"></i>';
                submitBtn.style.background = '#00c853'; // Green
                statusTxt.innerText = "Thanks! I'll get back to you at email soon.";
                statusTxt.style.color = '#00c853';
                
                // Reset form after delay
                setTimeout(() => {
                    contactForm.reset();
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.style.background = ''; // Reset color
                    submitBtn.disabled = false;
                    statusTxt.innerText = "";
                }, 5000);
            }, (error) => {
                // Error
                console.error('FAILED...', error);
                submitBtn.innerHTML = 'Failed <i class="fa-solid fa-xmark"></i>';
                submitBtn.style.background = '#ff4d4d'; // Red
                statusTxt.innerText = "Something went wrong. Please try again or email me directly.";
                statusTxt.style.color = '#ff4d4d';
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            });
    });
});

const slider = document.getElementById('slider');
let scrollAmount = 0;

function autoSlide() {
    const cardWidth = slider.querySelector('.para').clientWidth + 20; // card + gap
    const maxScroll = slider.scrollWidth - slider.clientWidth;

    if (scrollAmount >= maxScroll) {
        scrollAmount = 0; // Reset to start
    } else {
        scrollAmount += cardWidth;
    }
    
    slider.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
    });
}

// Slide every 3 seconds
let slideTimer = setInterval(autoSlide, 1000);

// Pause when mouse is over the cards
slider.addEventListener('mouseover', () => clearInterval(slideTimer));
slider.addEventListener('mouseout', () => slideTimer = setInterval(autoSlide, 3000));
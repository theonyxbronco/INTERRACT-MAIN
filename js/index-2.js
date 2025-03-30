/* ----------------------------------------------------- */
/* UTILITY FUNCTIONS */
/* ----------------------------------------------------- */
// Throttle function to limit how often a function runs
function throttle(func, limit) {
    let lastRan;
    let timeout;
    return function(...args) {
        if (!lastRan) {
            func.apply(this, args);
            lastRan = Date.now();
        } else {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(this, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    }
}

/* ----------------------------------------------------- */
/* HEADER BACKGROUND MOUSE EFFECT */
/* ----------------------------------------------------- */
// Images setup
const images = [
    "../imgs/header-1.png"
];

// Content setup
const texts = [
    [
        "agency", // Title Text
        "" // Sub Text
    ],
];

// Initialize RGB Kinetic Slider
const kineticSlider = new rgbKineticSlider({
    slideImages: images,
    itemsTitles: texts,
    backgroundDisplacementSprite: "https://i.ibb.co/N246LxD/map-9.jpg",
    cursorDisplacementSprite: "../imgs/1.jpg",
    cursorImgEffect: true,
    cursorTextEffect: true,
    cursorScaleIntensity: 0.6,
    cursorMomentum: 0.02,
    imagesRgbEffect: true,
    imagesRgbIntensity: 0.4,
    navImagesRgbIntensity: 80,
    textsDisplay: true,
    textsSubTitleDisplay: true,
    textsTiltEffect: true,
    googleFonts: ["Host Grotesk:400", "ID Grotesk:400"],
    buttonMode: false,
    textsRgbEffect: true,
    textsRgbIntensity: 0.01,
    navTextsRgbIntensity: 15,
    textTitlePositionX: 50,
    textTitlePositionY: -1000,
    textTitleColor: "rgba(255, 254, 234, 0.05)",
    textTitleSize: 400,
    mobileTextTitleSize: 125,
    textTitleLetterspacing: -2,
    textTitleLineHeight: 0.85,
    textSubTitleColor: "#FFFEEA",
    textSubTitleSize: 21,
    mobileTextSubTitleSize: 21,
    textSubTitleLetterspacing: -0.5,
    textSubTitleOffsetTop: 180,
    mobileTextSubTitleOffsetTop: 90,
});

/* ----------------------------------------------------- */
/* LIGHT FOLLOW MOUSE */
/* ----------------------------------------------------- */
const pos = document.querySelector('.mouse-light');
let targetX = window.innerWidth / 3;
let targetY = window.innerHeight / 3;
let currentX = targetX;
let currentY = targetY;

document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
});

function animateLight() {
    currentX += (targetX - currentX) * 0.03;
    currentY += (targetY - currentY) * 0.03;
    pos.style.background = `radial-gradient(circle at ${currentX}px ${currentY}px, transparent 0%, rgba(6, 7, 10, 0.96) 40%)`;
    requestAnimationFrame(animateLight);
}

animateLight();

/* ----------------------------------------------------- */
/* LOCOMOTIVE SCROLL INITIALIZATION */
/* ----------------------------------------------------- */
// Global variables for scroll optimization
let lastScrollY = 0;
let ticking = false;
const TRIGGER_POINT = 300;

// Cached DOM elements
const elements = {
    header: null,
    headerTexts: null,
    headerLine: null,
    fastContainer: null,
    navHr: null,
    navButtons: null,
    navLogoLarge: null,
    navLogoSmall: null
};

// Animation update functions
function updateHeaderTransforms(scrollY) {
    if (elements.header) {
        elements.header.style.transform = `translate3d(0, ${scrollY * 0.6}px, 0)`;
    }
    if (elements.fastContainer) {
        elements.fastContainer.style.transform = `translate3d(0, ${scrollY * -0.5}px, 0)`;
    }
}

function updateHeaderTexts(scrollY, viewportHeight) {
    if (!elements.headerTexts.length) return;
    
    const moveAmount = scrollY * 0.13;
    const startOffset = viewportHeight * 0.2;

    elements.headerTexts.forEach(text => {
        const rect = text.getBoundingClientRect();
        let opacity = 1;
        
        if (rect.top < startOffset) {
            opacity = Math.max(0, Math.min(1, 1 - (Math.abs(rect.top - startOffset) / (viewportHeight * 0.1))));
        }

        text.style.transform = `translate3d(0, ${moveAmount}px, 0)`;
        text.style.opacity = opacity;
    });
}

function updateHeaderLine(scrollY, viewportHeight) {
    if (!elements.headerLine) return;

    const moveAmount = scrollY * 0.13;
    const startOffset = viewportHeight * 0.48;
    const rect = elements.headerLine.getBoundingClientRect();
    let opacity = 0.3;

    if (rect.top < startOffset) {
        opacity = Math.max(0, Math.min(1, 0.3 - (Math.abs(rect.top - startOffset) / (viewportHeight * 0.1))));
    }

    elements.headerLine.style.transform = `translate3d(0, ${moveAmount}px, 0)`;
    elements.headerLine.style.opacity = opacity;
}

// Optimized resize handler
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Cache new element references and update scroll
        initializeElements();
        if (window.locoScroll) {
            window.locoScroll.update();
        }
    }, 250);
});

// Initialize DOM elements
function initializeElements() {
    elements.header = document.querySelector('.header');
    elements.headerTexts = document.querySelectorAll('.header-text-container');
    elements.headerLine = document.querySelector('.header-line');
    elements.fastContainer = document.querySelector('.fast-container');
    elements.navHr = document.querySelector('.desktop-nav-hr-container');
    elements.navButtons = document.querySelector('.desktop-nav-buttons');
    elements.navLogoLarge = document.querySelector('.nav-logo-large');
    elements.navLogoSmall = document.querySelector('.nav-logo-small');
}

document.addEventListener("DOMContentLoaded", function () {
    // Check for mobile device
    if (window.innerWidth <= 768) return;

    // Initialize elements
    initializeElements();

    // Register ScrollTrigger with GSAP
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Locomotive Scroll
    const locoScroll = new LocomotiveScroll({
        el: document.querySelector("#smooth-wrapper"),
        smooth: true,
        multiplier: 0.5
    });

    // Make locoScroll globally accessible
    window.locoScroll = locoScroll;

    // ScrollTrigger proxy setup
    ScrollTrigger.scrollerProxy("#smooth-wrapper", {
        scrollTop(value) {
            return arguments.length 
                ? locoScroll.scrollTo(value, 0, 0) 
                : locoScroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
            return {
                top: 0,
                left: 0,
                width: window.innerWidth,
                height: window.innerHeight
            };
        },
        pinType: document.querySelector("#smooth-wrapper").style.transform ? "transform" : "fixed"
    });

    // Optimized scroll handler
    locoScroll.on('scroll', ({ scroll }) => {
        const scrollY = scroll.y;
        const viewportHeight = window.innerHeight;
    
        // Simple transforms that don't need much calculation can run every frame
        if (elements.header) {
            elements.header.style.transform = `translate3d(0, ${scrollY * 0.6}px, 0)`;
        }
        if (elements.fastContainer) {
            elements.fastContainer.style.transform = `translate3d(0, ${scrollY * -0.5}px, 0)`;
        }
    
        // Handle the trigger point transitions
        if (scrollY >= TRIGGER_POINT) {
            elements.navLogoLarge.style.opacity = '0';
            elements.navLogoSmall.style.opacity = '1';
            elements.navButtons.style.opacity = '0';
            elements.navHr.style.width = '100%';
        } else {
            elements.navLogoLarge.style.opacity = '1';
            elements.navLogoSmall.style.opacity = '0';
            elements.navHr.style.width = '0%';
            elements.navButtons.style.opacity = '1';
            elements.navButtons.style.pointerEvents = 'auto';
        }
    
        // Use requestAnimationFrame only for the more complex animations
        requestAnimationFrame(() => {
            const moveAmount = scrollY * 0.13;
    
            // Header texts animation
            if (elements.headerTexts.length) {
                elements.headerTexts.forEach(text => {
                    const rect = text.getBoundingClientRect();
                    let opacity = 1;
                    
                    if (rect.top < viewportHeight * 0.2) {
                        opacity = Math.max(0, Math.min(1, 1 - (Math.abs(rect.top - (viewportHeight * 0.2)) / (viewportHeight * 0.1))));
                    }
    
                    text.style.transform = `translate3d(0, ${moveAmount}px, 0)`;
                    text.style.opacity = opacity;
                });
            }
    
            // Header line animation
            if (elements.headerLine) {
                const rect = elements.headerLine.getBoundingClientRect();
                let opacity = 0.3;
    
                if (rect.top < viewportHeight * 0.48) {
                    opacity = Math.max(0, Math.min(1, 0.3 - (Math.abs(rect.top - (viewportHeight * 0.48)) / (viewportHeight * 0.1))));
                }
    
                elements.headerLine.style.transform = `translate3d(0, ${moveAmount}px, 0)`;
                elements.headerLine.style.opacity = opacity;
            }
        });
    });

    // ScrollTrigger event listeners
    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
    locoScroll.on("scroll", ScrollTrigger.update);
    ScrollTrigger.refresh();
});
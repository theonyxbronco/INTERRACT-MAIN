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
// images setup
const images = [
    "../imgs/header-1.png"
];

// content setup
const texts = [
    [
        "agency", // Title Text
        "" // Sub Text
    ],
];

// init plugin
const kineticSlider = new rgbKineticSlider({
    slideImages: images, // array of images >demo size : 1920 x 1080
    itemsTitles: texts, // array of titles / subtitles

    /* ---------------- IMAGE EFFECT ---------------- */
    // displacement images sources
    backgroundDisplacementSprite: "https://i.ibb.co/N246LxD/map-9.jpg", // slide displacement image
    cursorDisplacementSprite: "../imgs/1.jpg", // cursor displacement image

    // cursor displacement effect
    cursorImgEffect: true, // enable cursor effect
    cursorTextEffect: true, // enable cursor text effect
    cursorScaleIntensity: 0.4,    // Reduced base intensity
    cursorMomentum: 0.015, // lower is slowery

    // image rgb effect
    imagesRgbEffect: true, // enable img rgb effect
    imagesRgbIntensity: 0.4,      // Start with moderate intensity
    navImagesRgbIntensity: 80, // set img rgb intensity for regular nav


    /* ---------------- TEXT EFFECT ---------------- */
    // texts settings
    textsDisplay: true, // show title
    textsSubTitleDisplay: true, // show subtitles
    textsTiltEffect: true, // enable text tilt
    googleFonts: ["Host Grotesk:400", "ID Grotesk:400"], // select google font to use
    buttonMode: false, // enable button mode for title
    textsRgbEffect: true, // enable text rgb effect
    textsRgbIntensity: 0.01, // set text rgb intensity
    navTextsRgbIntensity: 15, // set text rgb intensity for regular nav
    textTitlePositionX: 50,      // Distance from left edge in pixels
    textTitlePositionY: -1000,   

    textTitleColor: "rgba(255, 254, 234, 0.05)", // title color
    textTitleSize: 400, //400 // title size
    mobileTextTitleSize: 125, // title size
    textTitleLetterspacing: -2, // title letterspacing
    textTitleLineHeight: 0.85, // Adding line height control

    textSubTitleColor: "#FFFEEA", // subtitle color ex : 0x000000
    textSubTitleSize: 21, // subtitle size
    mobileTextSubTitleSize: 21, // mobile subtitle size
    textSubTitleLetterspacing: -0.5, // subtitle letter spacing
    textSubTitleOffsetTop: 180, // subtitle offset top
    mobileTextSubTitleOffsetTop: 90, // mobile subtitle offset top
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
/* LOCAMOTIVE SMOOTH SCROLL */
/* ----------------------------------------------------- */
/*let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        location.reload(); // Reload page on resize to reinitialize everything
    }, 250);
});*/


document.addEventListener("DOMContentLoaded", function () {
  // Check for mobile device FIRST
  if (window.innerWidth <= 768) {
    return;
}

// Register ScrollTrigger with GSAP
gsap.registerPlugin(ScrollTrigger);

// Initialize Locomotive Scroll
const locoScroll = new LocomotiveScroll({
    el: document.querySelector("#smooth-wrapper"),
    smooth: true,
    multiplier: 0.5
});

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


/* ----------------------------------------------------- */
/* TEXT REVEAL ANIMATION - MOVED INSIDE DOM CONTENT LOADED */
/* ----------------------------------------------------- */
const splitTypes = document.querySelectorAll(".reveal-type");

splitTypes.forEach((char, i) => {
    const bg = char.dataset.bgColor;
    const fg = char.dataset.fgColor;

    const text = new SplitType(char, { types: "chars" });

    gsap.fromTo(
        text.chars,
        {
            color: bg
        },
        {
            color: fg,
            duration: 0.3,
            stagger: 0.02,
            scrollTrigger: {
            trigger: char,
            start: "top 60%",
            end: "top 20%",
            scrub: true,
            markers: false, // "true" for debug
            toggleActions: "play play reverse reverse",
            scroller: "#smooth-wrapper" // This is crucial for Locomotive Scroll
            }
        }
    );
});


/* ------------------------------------- */
/* EVERYTHING ELSE LOL */
/* ------------------------------------- */
locoScroll.on('scroll', ({ scroll }) => {
    const scrollY = scroll.y;
    const viewportHeight = window.innerHeight;

    // Cache DOM elements
    const elements = {
        header: document.querySelector('.header'),
        headerTexts: document.querySelectorAll('.header-text-container'),
        headerLine: document.querySelector('.header-line'),
        fastContainer: document.querySelector('.fast-container'),
        navHr: document.querySelector('.desktop-nav-hr-container'),
        navButtons: document.querySelector('.desktop-nav-buttons'),
        navLogoLarge: document.querySelector('.nav-logo-large'),
        navLogoSmall: document.querySelector('.nav-logo-small'),
        introAction: document.querySelector('.intro-content-action'),
        capabilitiesSection: document.querySelector('.capabilities'),
    };

    // Desktop Nav logo Animation
    if (elements.navLogoLarge && elements.navLogoSmall) {
        if (scrollY >= 300) {
            elements.navLogoLarge.style.opacity = '0';
            elements.navLogoSmall.style.opacity = '1';
        } else {
            elements.navLogoLarge.style.opacity = '1';
            elements.navLogoSmall.style.opacity = '0';
        }
    }

    // Desktop Nav Line Animation
    if (elements.navHr && elements.navButtons) {
        if (scrollY >= 300) {
            setTimeout(() => elements.navHr.style.width = '100%', 200);
            elements.navButtons.style.opacity = '0';
        } else {
            elements.navHr.style.width = '0%';
            setTimeout(() => {
                elements.navButtons.style.opacity = '1';
                elements.navButtons.style.pointerEvents = 'auto';
            }, 200);
        }
    }

    // Header BG
    if (elements.header) {
        elements.header.style.transform = `translate3d(0, ${scrollY * 0.6}px, 0)`;
    }

    // Header Title
    if (elements.headerTexts.length) {
        const moveAmount = scrollY * 0.13;
        const startOffset = viewportHeight * 0.18;

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

    // Header Line
    if (elements.headerLine) {
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

    // Header Bottom Nav
    if (elements.fastContainer) {
        elements.fastContainer.style.transform = `translate3d(0, ${scrollY * -0.5}px, 0)`;
    }

    // Intro Action Scroll Speed
    if (elements.introAction) {
        elements.introAction.style.transform = `translate3d(0, ${scrollY * -0.15}px, 0)`;
    }

    // Capabilities Section
    if (elements.capabilitiesSection) {
        elements.capabilitiesSection.style.transform = `translate3d(0, ${scrollY * -0.36}px, 0)`;
    }
});


/* ------------------------------------- */
/* LOCAMOTIVE REGEN */
/* ------------------------------------- */
// Each time the window updates, refresh ScrollTrigger and update LocomotiveScroll
ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

// When the smooth scroll is updated, tell ScrollTrigger to update too
locoScroll.on("scroll", ScrollTrigger.update);

// After everything is set up, refresh ScrollTrigger
ScrollTrigger.refresh();
  
});
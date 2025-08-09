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
    cursorScaleIntensity: 0.3,    // Reduced base intensity
    cursorMomentum: 0.02, // lower is slowery

    // image rgb effect
    imagesRgbEffect: true, // enable img rgb effect
    imagesRgbIntensity: 0.2,      // Start with moderate intensity
    navImagesRgbIntensity: 40, // set img rgb intensity for regular nav


    /* ---------------- TEXT EFFECT ---------------- */
    // texts settings
    textsDisplay: true, // show title
    textsSubTitleDisplay: true, // show subtitles
    textsTiltEffect: true, // enable text tilt
    googleFonts: ["Host Grotesk:400", "ID Grotesk:400"], // select google font to use
    buttonMode: false, // enable button mode for title
    textsRgbEffect: true, // enable text rgb effect
    textsRgbIntensity: 0.005, // set text rgb intensity
    navTextsRgbIntensity: 7, // set text rgb intensity for regular nav
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


let sliderVisible = true;

// Create a function to check if slider is in viewport
function isSliderVisible(scrollY) {
    const slider = document.querySelector('.rgbKineticSlider');
    if (!slider) {
        console.log("Slider element not found in DOM");
        return false;
    }
    
    // With Locomotive Scroll, we need to use a different approach
    // The header is typically at the top of the page and spans 100vh
    // So we can simply check if the scroll position is less than viewport height
    const viewportHeight = window.innerHeight;
    const isVisible = scrollY < viewportHeight;
    
    console.log(`Locomotive scroll position: ${scrollY}, viewport height: ${viewportHeight}, isVisible: ${isVisible}`);
    
    return isVisible;
}


/* ----------------------------------------------------- */
/* LIGHT FOLLOW MOUSE */
/* ----------------------------------------------------- */
const pos = document.querySelector('.mouse-light');
let targetX = window.innerWidth / 3;
let targetY = window.innerHeight / 3;
let currentX = targetX;
let currentY = targetY;
let animationActive = true; // Flag to control animation

// Track mouse movement
document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
});

// Track scrolling
window.addEventListener('scroll', () => {
    // Check if scrolled beyond viewport height
    if (window.scrollY > window.innerHeight) {
        animationActive = false; // Stop animation
    } else {
        animationActive = true; // Resume animation
    }
});

function animateLight() {
    // Only update if animation is active
    if (animationActive) {
        currentX += (targetX - currentX) * 0.03;
        currentY += (targetY - currentY) * 0.03;
        pos.style.background = `radial-gradient(circle at ${currentX}px ${currentY}px, transparent 0%, rgba(6, 7, 10, 0.96) 40%)`;
    }

    // Always request next frame to keep the loop going
    requestAnimationFrame(animateLight);
}

// Start the animation
animateLight();


/* ----------------------------------------------------- */
/* LOCAMOTIVE SMOOTH SCROLL */
/* ----------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function () {
  // Check for mobile device FIRST
  if (window.innerWidth <= 768) {
    return;
}

// Initialize Locomotive Scroll
const locoScroll = new LocomotiveScroll({
    el: document.querySelector("#smooth-wrapper"),
    smooth: true,
    multiplier: 0.5
});

// Register ScrollTrigger with GSAP
gsap.registerPlugin(ScrollTrigger);

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
/* WEBGL PAUSE */
/* ----------------------------------------------------- */
const originalRequestAnimationFrame = window.requestAnimationFrame;
let animationHooked = false;

// Function to hook into requestAnimationFrame
function hookIntoAnimation() {
    if (animationHooked) return;
    
    // Override requestAnimationFrame
    window.requestAnimationFrame = function(callback) {
        // If the callback is from the kineticSlider and the slider is not visible,
        // we'll either slow it down dramatically or not call it at all
        const callbackString = callback.toString();
        const isKineticSliderCallback = callbackString.includes('rgbKineticSlider') || 
                                      callbackString.includes('PIXI') ||
                                      callbackString.includes('displacementFilter');
        
        if (isKineticSliderCallback && !sliderVisible) {
            console.log("Intercepted kineticSlider animation frame request");
            // Either don't schedule the callback at all:
            return 0;
            
            // OR slow it down dramatically by only running it occasionally:
            // return Math.random() < 0.05 ? originalRequestAnimationFrame(callback) : 0;
        }
        
        // For all other callbacks, or if the slider is visible, proceed normally
        return originalRequestAnimationFrame(callback);
    };
    
    animationHooked = true;
    console.log("Successfully hooked into requestAnimationFrame");
}

// Call this function after kineticSlider initialization
hookIntoAnimation();


/* ----------------------------------------------------- */
/* TEXT REVEAL ANIMATION - MOVED INSIDE DOM CONTENT LOADED */
/* ----------------------------------------------------- */
const splitTypes = document.querySelectorAll(".reveal-type");

splitTypes.forEach((char, i) => {
    const bg = char.dataset.bgColor;
    const fg = char.dataset.fgColor;

    // SplitType can be expensive - only run if not already processed
    if (!char.dataset.processed) {
        const text = new SplitType(char, { types: "chars" });
        char.dataset.processed = "true";
        
        // Reduce the animation complexity
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
                    start: "top 99%",
                    end: "top 50%",
                    scrub: 1, // Adding a 1 second smoothing to reduce calculation frequency
                    markers: false,
                    toggleActions: "play play reverse reverse",
                    scroller: "#smooth-wrapper"
                }
            }
        );
    }
});


/* ----------------------------------------------------- */
/* IMAGE HOVER UMD ANIMATION */
/* ----------------------------------------------------- */
new hoverEffect({
    parent: document.querySelector('.distortion'),
    intensity: 0.2,
    image1: '../imgs/culture.jpg',
    image2: '../imgs/1.jpg',
    displacementImage: '../imgs/heightMap.png',
    angle: Math.PI / 4,
    speed: 2.6,
    speedIn: 1.6,
    speedOut: 2.0,
    hover: true,
    easing: 'expo.out',
});


// Cache DOM elements
const elements = {
    header: document.querySelector('.header'),
    headerTexts: document.querySelectorAll('.header-text-container'),
    headerLine: document.querySelector('.header-line'),
    fastContainer: document.querySelector('.fast-buttons'),
    navHr: document.querySelector('.desktop-nav-hr-container'),
    navButtons: document.querySelector('.desktop-nav-buttons'),
    navLogoLarge: document.querySelector('.nav-logo-large'),
    navLogoSmall: document.querySelector('.nav-logo-small'),
    introAction: document.querySelector('.intro-content-action'),
    capabilitiesSection: document.querySelector('.capabilities'),
    casesSection: document.querySelector('.cases'),
    contactBG: document.querySelector('.contact-bg'),
    contactContent: document.querySelector('.contact-content-container'),
};

/* ------------------------------------- */
/* NEW SMOOTH SCROLL ANIMATION SYSTEM */
/* ------------------------------------- */
// Add these variables for smooth animation
let isScrolling = false;
let targetScrollY = 0;
let currentAnimationScrollY = 0;
let animationFrameId = null;

// Modify scroll handler to just capture target position and trigger animation
const throttledScrollHandler = throttle(({ scroll }) => {
    // Store the target scroll position
    targetScrollY = scroll.y;
    
    // Check slider visibility - this is for the WebGL pause feature
    const nowVisible = isSliderVisible(targetScrollY);
    if (nowVisible !== sliderVisible) {
        sliderVisible = nowVisible;
    }
    
    // Trigger animation loop if not already running
    if (!isScrolling) {
        isScrolling = true;
        if (!animationFrameId) {
            animationFrameId = requestAnimationFrame(updateAnimations);
        }
    }
}, 12);

/* ------------------------------------- */
/* ANIMATION LIST */
/* ------------------------------------- */
function updateAnimations() {
    // Calculate smooth transition towards target scroll position
    // This spreads the animation over multiple frames
    currentAnimationScrollY += (targetScrollY - currentAnimationScrollY) * 0.2;
    
    // If we're very close to the target, snap to it
    if (Math.abs(targetScrollY - currentAnimationScrollY) < 0.1) {
        currentAnimationScrollY = targetScrollY;
        isScrolling = false;
    }
    
    // Get viewport height for calculations
    const viewportHeight = window.innerHeight;
    const isMobile = window.innerWidth <= 768;
    
    // BATCH ALL DOM READS FIRST
    const measurements = {};
    if (elements.headerTexts.length) {
        measurements.headerTextRect = elements.headerTexts[0].getBoundingClientRect();
    }
    
    // Then perform all DOM writes based on the smoothed scroll position
    
    // Desktop Nav logo Animation (runs on all devices)
    if (elements.navLogoLarge && elements.navLogoSmall) {
        if (currentAnimationScrollY >= 300) {
            elements.navLogoLarge.style.opacity = '0';
            elements.navLogoSmall.style.opacity = '1';
        } else {
            elements.navLogoLarge.style.opacity = '1';
            elements.navLogoSmall.style.opacity = '0';
        }
    }

    // Desktop Nav Line Animation (runs on all devices)
    if (elements.navHr && elements.navButtons) {
        if (currentAnimationScrollY >= 300) {
            elements.navHr.style.width = '100%';
            elements.navButtons.style.opacity = '0';
        } else {
            elements.navHr.style.width = '0%';
            elements.navButtons.style.opacity = '1';
            elements.navButtons.style.pointerEvents = 'auto';
        }
    }

    // PARALLAX TRANSFORMS - DESKTOP ONLY
    if (!isMobile) {
        // Header BG
        if (elements.header) {
            elements.header.style.transform = `translate3d(0, ${currentAnimationScrollY * 0.6}px, 0)`;
        }

        // Header Line movement
        if (elements.headerLine) {
            const moveAmount = currentAnimationScrollY * 0.13;
            elements.headerLine.style.transform = `translate3d(0, ${moveAmount}px, 0)`;
        }

        // Header Bottom Nav movement
        if (elements.fastContainer) {
            elements.fastContainer.style.transform = `translate3d(0, ${currentAnimationScrollY * -0.5}px, 0)`;
        }

        // Intro Action Scroll Speed
        if (elements.introAction) {
            elements.introAction.style.transform = `translate3d(0, ${currentAnimationScrollY * -0.15}px, 0)`;
        }

        // Capabilities Section
        if (elements.capabilitiesSection) {
            elements.capabilitiesSection.style.transform = `translate3d(0, ${currentAnimationScrollY * -0.36}px, 0)`;
        }

        // Cases Section
        if (elements.casesSection) {
            elements.casesSection.style.transform = `translate3d(0, ${currentAnimationScrollY * -0.16}px, 0)`;
        }

        // Contact Section
        if (elements.contactBG) {
            elements.contactBG.style.transform = `translate3d(0, ${currentAnimationScrollY * 0.15}px, 0)`;
        } 

        // Contact Text
        if (elements.contactContent) {
            elements.contactContent.style.transform = `translate3d(0, ${currentAnimationScrollY * 0.1}px, 0)`;
        } 
    }

    // OPACITY ANIMATIONS - RUN ON ALL DEVICES
    // Header Title
    if (elements.headerTexts.length && measurements.headerTextRect) {
        const startOffset = viewportHeight * 0.12;
        const baseTop = measurements.headerTextRect.top;
        
        elements.headerTexts.forEach(text => {
            let opacity = 1;
            
            if (baseTop < startOffset) {
                opacity = Math.max(0, Math.min(1, 1 - (Math.abs(baseTop - startOffset) / (viewportHeight * 0.1))));
            }

            // Only apply transform movement on desktop
            if (!isMobile) {
                const moveAmount = currentAnimationScrollY * 0.08;
                text.style.transform = `translate3d(0, ${moveAmount}px, 0)`;
            }
            text.style.opacity = opacity;
        });
    }

    // Header Line opacity
    if (elements.headerLine) {
        const scrollThreshold = viewportHeight * 0.3;
        let opacity = 0.3;
        
        if (currentAnimationScrollY > scrollThreshold) {
            opacity = Math.max(0, 0.3 - ((currentAnimationScrollY - scrollThreshold) / 300));
        }
        
        elements.headerLine.style.opacity = opacity;
    }

    // Header Bottom Nav opacity
    if (elements.fastContainer && measurements.headerTextRect) {
        const startOffset = viewportHeight * 0.6;
        const estimatedTop = measurements.headerTextRect.top + 300;
        let opacity = 1;

        if (estimatedTop < startOffset) {
            opacity = Math.max(0, Math.min(1, 1 - (Math.abs(estimatedTop - startOffset) / (viewportHeight * 0.3))));
        }

        elements.fastContainer.style.opacity = opacity;
    }

    
    // Schedule the next frame if still scrolling or not fully converged
    if (isScrolling || Math.abs(targetScrollY - currentAnimationScrollY) > 0.1) {
        animationFrameId = requestAnimationFrame(updateAnimations);
    } else {
        animationFrameId = null;
    }
}

// Use our modified scroll handler with Locomotive Scroll
locoScroll.on('scroll', throttledScrollHandler);

/* ------------------------------------- */
/* LOCAMOTIVE REGEN */
/* ------------------------------------- */
// Each time the window updates, refresh ScrollTrigger and update LocomotiveScroll
ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

// When the smooth scroll is updated, tell ScrollTrigger to update too
// Only do this when not actively scrolling to reduce load
locoScroll.on("scroll", throttle(() => {
    if (!isScrolling) {
        ScrollTrigger.update();
    }
}, 100)); // This is set to 100ms, or 10fps

// After everything is set up, refresh ScrollTrigger
ScrollTrigger.refresh();
  
});
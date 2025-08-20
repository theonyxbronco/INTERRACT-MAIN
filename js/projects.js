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

/* -------------------------------------------------------------------------------- */
/* NEW SMOOTH SCROLL ANIMATION SYSTEM */
/* -------------------------------------------------------------------------------- */
// Cache DOM elements
const elements = {
   navHr: document.querySelector('.desktop-nav-hr-container'),
   navButtons: document.querySelector('.desktop-nav-buttons'),
   navLogoLarge: document.querySelector('.nav-logo-large'),
   navLogoSmall: document.querySelector('.nav-logo-small'),
   header: document.getElementById('header_content'),
   worksImg: document.getElementById('works_img'),
};

// Add these variables for smooth animation
let isScrolling = false;
let targetScrollY = 0;
let currentAnimationScrollY = 0;
let animationFrameId = null;

// Modify scroll handler to just capture target position and trigger animation
const throttledScrollHandler = throttle(({ scroll }) => {
   // Store the target scroll position
   targetScrollY = scroll.y;
   
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
           elements.navHr.style.setProperty('width', '100%', 'important');
           elements.navButtons.style.opacity = '0';
       } else {
           elements.navHr.style.setProperty('width', '0%', 'important');
           elements.navButtons.style.opacity = '1';
           elements.navButtons.style.pointerEvents = 'auto';
       }
   }

   // PARALLAX TRANSFORMS - DESKTOP ONLY
    if (!isMobile) {
        // Header Content
        if (elements.header) {
            elements.header.style.transform = `translate3d(0, ${currentAnimationScrollY * 0.6}px, 0)`;

            // Add fade out animation
            const fadeStart = 0;
            const fadeEnd = 250; // Adjust this value to control when the fade completes
            const fadeProgress = Math.min(Math.max((currentAnimationScrollY - fadeStart) / (fadeEnd - fadeStart), 0), 1);
            elements.header.style.opacity = 1 - fadeProgress;
        }

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
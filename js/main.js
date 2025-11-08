/*-------------------------------------------------*/
/* ANIMATE ANIMATION SET-UP */
/*-------------------------------------------------*/
const pictures = document.querySelectorAll(".animate");

observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.boundingClientRect.top > 0) {
            // Apply the animation when scrolling down into the element
            entry.target.style.animation = `${entry.target.dataset.type || "fade-up"} ${entry.target.dataset.duration || "1s"} ${entry.target.dataset.delay || "0.5s"} forwards ${entry.target.dataset.curve || "ease-out"}`;
        } else if (!entry.isIntersecting && entry.boundingClientRect.top > 0) {
            // Reset the animation when scrolling up past the element (i.e., when it exits from the top)
            entry.target.style.animation = 'none';
            // Trigger reflow to restart the animation when it comes back into view
            entry.target.offsetHeight; // This forces a reflow, allowing the animation to restart
        }
    });
});

pictures.forEach(picture => {
    observer.observe(picture);
});


/* ----------------------------------------------------- */
/* LOADER ANIMATION - FIXED START FROM 0 */
/* ----------------------------------------------------- */
let loadingProgress = 0;
let minTimeElapsed = false;
const loadingBar = document.querySelector('.loading-bar');
const loadingScreens = document.querySelectorAll('.loading-screen');
const loadingContent = document.getElementById('loadingContent');
const MINIMUM_LOADING_TIME = 1500; // 1.5 seconds minimum

// Function to update loading bar with smooth animation
function updateLoadingBar(progress) {
    loadingProgress = progress;
    
    if (loadingBar) {
        // Force a reflow to ensure the transition works
        loadingBar.style.width = `${progress}%`;
        console.log(`Loading progress: ${progress}%`);
    }
    
    // Check if we can finish loading
    if (progress >= 100 && minTimeElapsed) {
        setTimeout(startScreenAnimations, 500);
    }
}

// Initialize loading bar at 0%
function initializeLoadingBar() {
    if (loadingBar) {
        loadingBar.style.width = '0%';
        console.log('Loading bar initialized at 0%');
    }
}

// Ensure minimum loading time
setTimeout(() => {
    minTimeElapsed = true;
    console.log('Minimum loading time elapsed');
    // If progress is already 100%, start animations
    if (loadingProgress >= 100) {
        setTimeout(startScreenAnimations, 500);
    }
}, MINIMUM_LOADING_TIME);

// Simulate smooth loading progression
function trackLoadingProgress() {
    // Start the progress at 0
    updateLoadingBar(0);
    
    // Get images to track
    const images = document.querySelectorAll('img');
    const totalResources = Math.max(images.length, 1);
    let loadedResources = 0;
    
    console.log(`Total images to load: ${images.length}`);
    
    // Add some initial progress immediately for visual feedback
    setTimeout(() => updateLoadingBar(10), 100);
    
    // Function to increment progress smoothly
    function incrementProgress() {
        loadedResources++;
        // Calculate progress with some buffer for smooth animation
        const rawProgress = (loadedResources / totalResources) * 85; // Go to 85% for resources
        const progress = Math.min(Math.round(rawProgress), 85);
        updateLoadingBar(progress);
        
        console.log(`Loaded: ${loadedResources}/${totalResources} (${progress}%)`);
        
        // If all resources loaded, finish the remaining progress smoothly
        if (loadedResources >= totalResources) {
            finishLoading();
        }
    }
    
    // Function to smoothly finish loading from 85% to 100%
    function finishLoading() {
        let currentProgress = 85;
        const finishInterval = setInterval(() => {
            currentProgress += 5;
            if (currentProgress >= 100) {
                currentProgress = 100;
                clearInterval(finishInterval);
            }
            updateLoadingBar(currentProgress);
        }, 50); // Update every 50ms for smooth finish
    }
    
    // Track images
    if (images.length > 0) {
        images.forEach((img, index) => {
            if (img.complete && img.naturalWidth > 0) {
                setTimeout(() => incrementProgress(), index * 50); // Stagger for visual effect
            } else {
                const timeout = setTimeout(() => {
                    console.log(`Image ${index + 1} timed out:`, img.src);
                    incrementProgress();
                }, 3000);
                
                img.addEventListener('load', () => {
                    clearTimeout(timeout);
                    console.log(`Image ${index + 1} loaded:`, img.src);
                    incrementProgress();
                }, { once: true });
                
                img.addEventListener('error', () => {
                    clearTimeout(timeout);
                    console.log(`Image ${index + 1} failed:`, img.src);
                    incrementProgress();
                }, { once: true });
            }
        });
    } else {
        // No images - simulate loading for visual effect
        console.log('No images found, simulating loading...');
        let fakeProgress = 0;
        const fakeInterval = setInterval(() => {
            fakeProgress += Math.random() * 15;
            if (fakeProgress >= 100) {
                fakeProgress = 100;
                clearInterval(fakeInterval);
            }
            updateLoadingBar(Math.round(fakeProgress));
        }, 100);
    }
    
    // Fallback: Force completion after 6 seconds
    setTimeout(() => {
        if (loadingProgress < 100) {
            console.log('Force completing loading');
            updateLoadingBar(100);
        }
    }, 6000);
}

// Function to start screen animations
function startScreenAnimations() {
    console.log('Starting screen animations');
    
    if (loadingContent) {
        loadingContent.classList.add('hide');
    }
    
    loadingScreens.forEach(screen => {
        screen.classList.add('loaded');
    });
    
    document.body.classList.add('loaded');
    const headerLine = document.querySelector('.header-line');
    const kineticSlider = document.querySelector('.rgbKineticSlider');
    if (headerLine) headerLine.classList.add('loaded');
    if (kineticSlider) kineticSlider.classList.add('loaded');
}

// Start everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing loader');
    initializeLoadingBar();
    
    // Small delay to ensure everything is ready
    setTimeout(() => {
        trackLoadingProgress();
    }, 50);
});

/* ----------------------------------------------------- */
/* FAVICON COLOR BROWSER MATCH */
/* ----------------------------------------------------- */
// // Function to check if a color is light or dark
// function isColorLight(r, g, b) {
//     // Using relative luminance formula
//     // Colors are considered light if luminance is greater than 0.5
//     const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
//     return luminance > 0.5;
// }

// // Function to get browser's background color
// function getBrowserColor() {
//     // Create a test element
//     const testEl = document.createElement('div');
//     testEl.style.display = 'none';
//     document.body.appendChild(testEl);
    
//     // Get the computed background color
//     const color = window.getComputedStyle(testEl).backgroundColor;
//     document.body.removeChild(testEl);
    
//     // Parse the RGB values
//     const match = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
//     if (match) {
//         return {
//             r: parseInt(match[1]),
//             g: parseInt(match[2]),
//             b: parseInt(match[3])
//         };
//     }
    
//     return null;
// }

// // Function to update the favicon based on the background color
// let faviconCurrentlyDark = null;

// function updateFavicon() {
//     const favicon = document.getElementById('favicon');
//     const appleIcon = document.getElementById('apple-touch-icon');
    
//     if (!favicon || !appleIcon) return; // Avoid errors if elements don't exist
    
//     // Get the actual browser background color
//     const browserColor = getBrowserColor();
//     let shouldBeDark = false;
    
//     // If we can detect the browser color, use that
//     if (browserColor) {
//         shouldBeDark = !isColorLight(browserColor.r, browserColor.g, browserColor.b);
//     } else {
//         // Fallback to system preference if we can't detect color
//         shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
//     }
    
//     // Only update if the favicon state has changed
//     if (faviconCurrentlyDark !== shouldBeDark) {
//         if (shouldBeDark) {
//             favicon.href = 'imgs/icons/favicon-light.svg';
//             appleIcon.href = 'imgs/icons/favicon-light.svg';
//         } else {
//             favicon.href = 'imgs/icons/favicon-dark.svg';
//             appleIcon.href = 'imgs/icons/favicon-dark.svg';
//         }
        
//         faviconCurrentlyDark = shouldBeDark;
//     }
// }

// // Run when page loads
// if (document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', updateFavicon);
// } else {
//     updateFavicon();
// }

// // Listen for system theme changes
// window.matchMedia('(prefers-color-scheme: dark)')
//     .addEventListener('change', updateFavicon);

// // Add an event listener for when the window regains focus
// window.addEventListener('focus', updateFavicon);


/* ----------------------------------------------------- */
/* CURSOR DOT AND RING */
/* ----------------------------------------------------- */
let mouseX = 0, mouseY = 0;
let dotX = 0, dotY = 0;
let ringX = 0, ringY = 0;
const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    // Faster dot
    dotX += (mouseX - dotX) * 0.1;
    dotY += (mouseY - dotY) * 0.1;
    
    // Slower ring
    ringX += (mouseX - ringX) * 0.06;
    ringY += (mouseY - ringY) * 0.06;
    
    dot.style.transform = `translate(${dotX}px, ${dotY}px)`;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(animateCursor);
}

animateCursor();

const links = document.querySelectorAll('.link');
links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        ring.classList.add('is-hovering');
        dot.classList.add('is-hovering');
    });
    
    link.addEventListener('mouseleave', () => {
        ring.classList.remove('is-hovering');
        dot.classList.remove('is-hovering');
    });
});



/*-------------------------------------------------*/
/* Navigation Open Animation */
/*-------------------------------------------------*/
function openNav() {
    document.getElementById("mySidenav").style.transform = "translateX(0%)";
    document.getElementById("mySidenav").style.transition = "all 1.8s cubic-bezier(0.16, 1, 0.3, 1)";
    document.getElementById("smooth-wrapper").style.transform = "translateX(100px)";
    document.getElementById("smooth-wrapper").style.transition = "all 3.1s cubic-bezier(0.16, 1, 0.3, 1)";
    document.getElementById("opener").style.opacity = "0";
    document.getElementById("closebtn").style.opacity = "1";
}
  
  function closeNav() {
    document.getElementById("mySidenav").style.transform = "translateX(-100%)";
    document.getElementById("mySidenav").style.transition = "all 1.2s cubic-bezier(0.2, 0, 0.54, 0)";
    document.getElementById("smooth-wrapper").style.transform = "translateX(0)";
    document.getElementById("smooth-wrapper").style.transition = "all 2.8s cubic-bezier(0.16, 1, 0.3, 1)";
    document.getElementById("opener").style.opacity = "1";
    document.getElementById("closebtn").style.opacity = "0";
}


/*-------------------------------------------------*/
/* BUTTON HOVER MAGNET */
/*-------------------------------------------------*/
const buttons = document.querySelectorAll(".magnet-effect");
const bigButtons = document.querySelectorAll(".magnet-effect-big");
const threshold = 100;
const bigThreshold = 1000; // Bigger threshold for large elements
const magnetStrength = 1.0;
const bigMagnetStrength = 0.1;
const originalStyles = new Map();

// Function to check if we're in mobile view
function isMobileView() {
   return window.innerWidth <= 1000;
}

// Function to initialize magnet effect
function initMagnetEffect() {
   if (isMobileView()) {
       return;
   }

   // Handle regular magnet buttons
   buttons.forEach((button) => {
       originalStyles.set(button, button.style.cssText || "");
       if (getComputedStyle(button).position === "static") {
           button.style.position = "relative";
       }
   });

   // Handle big magnet buttons
   bigButtons.forEach((button) => {
       originalStyles.set(button, button.style.cssText || "");
       if (getComputedStyle(button).position === "static") {
           button.style.position = "relative";
       }
   });
   
   document.addEventListener("mousemove", handleMouseMove);
   document.addEventListener("mouseleave", resetButtonStyles);
}

// Mouse move handler
function handleMouseMove(e) {
   if (isMobileView()) {
       return;
   }

   const mouseX = e.clientX;
   const mouseY = e.clientY;
   
   // Handle regular buttons with custom or default strength
   buttons.forEach((button) => {
       const customStrength = parseFloat(button.dataset.magnetStrength) || magnetStrength;
       const customThreshold = parseFloat(button.dataset.magnetThreshold) || threshold;
       applyMagnetEffect(button, mouseX, mouseY, customThreshold, customStrength);
   });

   // Handle big buttons with custom or default strength
   bigButtons.forEach((button) => {
       const customStrength = parseFloat(button.dataset.magnetStrength) || bigMagnetStrength;
       const customThreshold = parseFloat(button.dataset.magnetThreshold) || bigThreshold;
       applyMagnetEffect(button, mouseX, mouseY, customThreshold, customStrength);
   });
}

// Extracted magnet effect logic - now accepts magnetStrength parameter
function applyMagnetEffect(button, mouseX, mouseY, currentThreshold, currentMagnetStrength) {
   const buttonRect = button.getBoundingClientRect();
   const buttonCenterX = buttonRect.left + buttonRect.width / 2;
   const buttonCenterY = buttonRect.top + buttonRect.height / 2;
   
   const deltaX = mouseX - buttonCenterX;
   const deltaY = mouseY - buttonCenterY;
   const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
   
   if (distance < currentThreshold) {
       const scale = 1 - distance / currentThreshold;
       const translateX = deltaX * currentMagnetStrength * scale;
       const translateY = deltaY * currentMagnetStrength * scale;
       
       button.style.transition = "transform 2s cubic-bezier(0.16, 1, 0.3, 1)";
       button.style.transform = `translate(${translateX}px, ${translateY}px)`;
       button.style.scale = `${1 + scale * 0.01}`;
   } else {
       button.style.transition = "transform 2.5s cubic-bezier(0.2, 1, 0.3, 1), scale 2.5s cubic-bezier(0.2, 1, 0.3, 1)";
       button.style.transform = "translate(0, 0)";
       button.style.scale = "1";
   }
}

// Reset button styles
function resetButtonStyles() {
   [...buttons, ...bigButtons].forEach((button) => {
       button.style.transition = "transform 2.5s cubic-bezier(0.2, 1, 0.3, 1), scale 2.5s cubic-bezier(0.2, 1, 0.3, 1)";
       button.style.transform = "translate(0, 0)";
       button.style.scale = "1";
   });
}

// Clean up magnet effect
function cleanupMagnetEffect() {
   [...buttons, ...bigButtons].forEach((button) => {
       button.style.transform = "translate(0, 0)";
       button.style.scale = "1";
       button.style.transition = "";
   });
   
   document.removeEventListener("mousemove", handleMouseMove);
   document.removeEventListener("mouseleave", resetButtonStyles);
}

// Initialize on load
initMagnetEffect();

// Handle window resize
window.addEventListener('resize', () => {
   if (isMobileView()) {
       cleanupMagnetEffect();
   } else {
       initMagnetEffect();
   }
});


/*-------------------------------------------------*/
/* COOKIE CONSENT FUNCTIONALITY */
/*-------------------------------------------------*/
class CookieConsent {
    constructor() {
        this.cookieName = 'interract_cookie_consent';
        this.cookieExpiry = 365; // days
        this.init();
    }

    init() {
        // Check if consent has already been given
        if (!this.hasConsent()) {
            // Delay showing the banner by 5 seconds
            setTimeout(() => {
                this.showCookieBanner();
            }, 5000);
        }
    }

    hasConsent() {
        return localStorage.getItem(this.cookieName) === 'accepted';
    }

    showCookieBanner() {
        // Create cookie banner if it doesn't exist
        if (!document.getElementById('cookie-banner')) {
            this.createCookieBanner();
        }
        
        // Show the banner with smooth animation
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            // Force a reflow to ensure the element is rendered in its initial state
            banner.offsetHeight;
            
            // Add smooth show animation after a tiny delay
            requestAnimationFrame(() => {
                banner.classList.add('show');
            });
        }
    }

    createCookieBanner() {
        const banner = document.createElement('div');
        banner.id = 'cookie-banner';
        banner.className = 'cookie-banner';
        banner.innerHTML = `
            <div class="cookie-content">
                <div class="cookie-text">
                    <p>We use cookies to enhance your browsing experience and analyze our traffic. By clicking "Accept", you consent to our use of cookies.</p>
                </div>
                <div class="cookie-actions">
                    <button id="cookie-accept" class="cookie-btn cookie-accept">Accept</button>
                    <button id="cookie-decline" class="cookie-btn cookie-decline">Decline</button>
                    <a href="/privacy-policy" class="cookie-learn-more">Learn more</a>
                </div>
            </div>
        `;
        
        document.body.appendChild(banner);
        this.bindEvents();
    }

    bindEvents() {
        const acceptBtn = document.getElementById('cookie-accept');
        const declineBtn = document.getElementById('cookie-decline');
        
        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => this.acceptCookies());
        }
        
        if (declineBtn) {
            declineBtn.addEventListener('click', () => this.declineCookies());
        }
    }

    acceptCookies() {
        // Store consent in localStorage
        localStorage.setItem(this.cookieName, 'accepted');
        localStorage.setItem(this.cookieName + '_date', new Date().toISOString());
        
        // Hide banner
        this.hideBanner();
        
        // Initialize analytics or other tracking here
        this.initializeTracking();
        
        console.log('Cookies accepted');
    }

    declineCookies() {
        // Store decline in localStorage
        localStorage.setItem(this.cookieName, 'declined');
        localStorage.setItem(this.cookieName + '_date', new Date().toISOString());
        
        // Hide banner
        this.hideBanner();
        
        console.log('Cookies declined');
    }

    hideBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.classList.add('hide');
            setTimeout(() => {
                banner.remove();
            }, 300);
        }
    }

    initializeTracking() {
        // Only initialize tracking if user accepted
        if (this.hasConsent()) {
            console.log('Initializing tracking scripts...');
            
            // Load Google Analytics (with duplicate check)
            this.loadGoogleAnalytics();
            
            // Load Hotjar (with duplicate check)
            this.loadHotjar();
        }
    }

    loadGoogleAnalytics() {
        // Check if Google Analytics is already loaded
        if (window.gtag || document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
            console.log('Google Analytics already loaded, skipping initialization');
            return;
        }

        // Google Analytics 4 (GA4) setup
        const GA_MEASUREMENT_ID = 'G-VTZ7QZ0D4W';
        
        // Load Google Analytics script
        const gaScript = document.createElement('script');
        gaScript.async = true;
        gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
        gaScript.onerror = () => console.warn('Google Analytics failed to load');
        document.head.appendChild(gaScript);
        
        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', GA_MEASUREMENT_ID, {
            // Privacy-friendly settings
            anonymize_ip: true,
            cookie_flags: 'SameSite=None;Secure'
        });
        
        console.log('Google Analytics loaded');
    }

    loadHotjar() {
        // Check if Hotjar is already loaded
        if (window.hj || document.querySelector('script[src*="contentsquare.net/uxa"]')) {
            console.log('Hotjar already loaded, skipping initialization');
            return;
        }

        // Load Hotjar using your provided script
        const hotjarScript = document.createElement('script');
        hotjarScript.src = 'https://t.contentsquare.net/uxa/d74374e4af2d5.js';
        hotjarScript.async = true;
        hotjarScript.onerror = () => console.warn('Hotjar failed to load');
        document.head.appendChild(hotjarScript);
        
        console.log('Hotjar loaded');
    }

    // Method to check consent status (use this before any tracking)
    canTrack() {
        return this.hasConsent();
    }
}

// Initialize cookie consent when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.cookieConsent = new CookieConsent();
});
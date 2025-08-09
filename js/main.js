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
/* lOADER ANIMATION */
/* ----------------------------------------------------- */
window.addEventListener('load', function() {
    // This event fires when ALL resources have completely loaded
    const loadingScreens = document.querySelectorAll('.loading-screen');
    const body = document.body;
    const headerLine = document.querySelector('.header-line');
    const kineticSlider = document.querySelector('.rgbKineticSlider');
    
    // Give a small delay to ensure everything has rendered
    setTimeout(() => {
        // Make sure main-content is visible for the transition
        document.getElementById('main-content').style.opacity = '0';
        document.getElementById('main-content').style.transformOrigin = 'center';
        
        // Start the transitions for all loading screens
        loadingScreens.forEach(screen => {
            screen.classList.add('loaded');
        });
        
        // Add loaded classes to other elements
        body.classList.add('loaded');
        headerLine.classList.add('loaded');
        kineticSlider.classList.add('loaded');
    }, 500);
});


/* ----------------------------------------------------- */
/* FAVICON COLOR BROWSER MATCH */
/* ----------------------------------------------------- */
// Function to check if a color is light or dark
function isColorLight(r, g, b) {
    // Using relative luminance formula
    // Colors are considered light if luminance is greater than 0.5
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
}

// Function to get browser's background color
function getBrowserColor() {
    // Create a test element
    const testEl = document.createElement('div');
    testEl.style.display = 'none';
    document.body.appendChild(testEl);
    
    // Get the computed background color
    const color = window.getComputedStyle(testEl).backgroundColor;
    document.body.removeChild(testEl);
    
    // Parse the RGB values
    const match = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (match) {
        return {
            r: parseInt(match[1]),
            g: parseInt(match[2]),
            b: parseInt(match[3])
        };
    }
    
    return null;
}

// Function to update the favicon based on the background color
let faviconCurrentlyDark = null;

function updateFavicon() {
    const favicon = document.getElementById('favicon');
    const appleIcon = document.getElementById('apple-touch-icon');
    
    if (!favicon || !appleIcon) return; // Avoid errors if elements don't exist
    
    // Get the actual browser background color
    const browserColor = getBrowserColor();
    let shouldBeDark = false;
    
    // If we can detect the browser color, use that
    if (browserColor) {
        shouldBeDark = !isColorLight(browserColor.r, browserColor.g, browserColor.b);
    } else {
        // Fallback to system preference if we can't detect color
        shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    // Only update if the favicon state has changed
    if (faviconCurrentlyDark !== shouldBeDark) {
        if (shouldBeDark) {
            favicon.href = 'imgs/icons/favicon-light.svg';
            appleIcon.href = 'imgs/icons/favicon-light.svg';
        } else {
            favicon.href = 'imgs/icons/favicon-dark.svg';
            appleIcon.href = 'imgs/icons/favicon-dark.svg';
        }
        
        faviconCurrentlyDark = shouldBeDark;
    }
}

// Run when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateFavicon);
} else {
    updateFavicon();
}

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', updateFavicon);

// Add an event listener for when the window regains focus
window.addEventListener('focus', updateFavicon);


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
const threshold = 100; // Reduced threshold for more sensitivity (try 100-200)
const magnetStrength = 1.0; // Increased strength (try 1.0-2.0)

const originalStyles = new Map();

buttons.forEach((button) => {
  // Store original styles
  originalStyles.set(button, button.style.cssText || "");
  
  if (getComputedStyle(button).position === "static") {
    button.style.position = "relative";
  }
  
  // Track mouse movement over entire document to ensure the effect works from a distance
  document.addEventListener("mousemove", (e) => {
    // Get mouse coordinates relative to the viewport
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Get button's position relative to the viewport
    const buttonRect = button.getBoundingClientRect();
    const buttonCenterX = buttonRect.left + buttonRect.width / 2;
    const buttonCenterY = buttonRect.top + buttonRect.height / 2;
    
    // Calculate distance between mouse and button center
    const deltaX = mouseX - buttonCenterX;
    const deltaY = mouseY - buttonCenterY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Apply transformation if within threshold
    if (distance < threshold) {
      // Scale effect based on distance (stronger when closer)
      const scale = 1 - distance / threshold;
      const translateX = deltaX * magnetStrength * scale;
      const translateY = deltaY * magnetStrength * scale;
      
      // Apply transform with transition for smoother movement
      button.style.transition = "transform 0.6s ease-out";
      button.style.transform = `translate(${translateX}px, ${translateY}px)`;
      
      // Optional: add a subtle scale effect on hover
      button.style.scale = `${1 + scale * 0.01}`;
    } else {
      // Reset position with a smoother transition
      button.style.transition = "transform 2.5s cubic-bezier(0.2, 1, 0.3, 1), scale 2.5s cubic-bezier(0.2, 1, 0.3, 1)";
      button.style.transform = "translate(0, 0)";
      button.style.scale = "1";
    }
  });
  
  // Reset styles when mouse leaves the document
  document.addEventListener("mouseleave", () => {
    button.style.transition = "transform 2.5s cubic-bezier(0.2, 1, 0.3, 1), scale 2.5s cubic-bezier(0.2, 1, 0.3, 1)";
    button.style.transform = "translate(0, 0)";
    button.style.scale = "1";
  });
});


/*-------------------------------------------------*/
/* COOKIES FUNCTION */
/*-------------------------------------------------*/
// Function to load analytics scripts
function loadAnalytics() {
    // Load Google Analytics
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-VTZ7QZ0D4W';
    document.head.appendChild(gaScript);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
        dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', 'G-VTZ7QZ0D4W');

    // Load Hotjar
    (function(c, s, q, u, a, r, e) {
        c.hj = c.hj || function() {
            (c.hj.q = c.hj.q || []).push(arguments);
        };
        c._hjSettings = { hjid: 5356483 };
        r = s.getElementsByTagName('head')[0];
        e = s.createElement('script');
        e.async = true;
        e.src = q + c._hjSettings.hjid + u;
        r.appendChild(e);
    })(window, document, 'https://static.hj.contentsquare.net/c/csq-', '.js');
}

// Function to check cookie consent status
function checkCookieConsent() {
    const consent = localStorage.getItem('cookieConsent');
    console.log('Current cookie consent status:', consent); // Debug line
    
    if (!consent) {
        const popup = document.getElementById('cookieConsent');
        console.log('Popup element:', popup); // Debug line
        if (popup) {
            popup.style.display = 'block';
        } else {
            console.log('Cookie consent popup element not found!'); // Debug line
        }
    } else if (consent === 'accepted') {
        loadAnalytics();
    }
}

// Function to handle accepting cookies
function acceptCookies() {
    localStorage.setItem('cookieConsent', 'accepted');
    document.getElementById('cookieConsent').style.display = 'none';
    loadAnalytics();
}

// Function to handle denying cookies
function denyCookies() {
    localStorage.setItem('cookieConsent', 'denied');
    document.getElementById('cookieConsent').style.display = 'none';
}

// Check cookie consent when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, checking cookie consent...'); // Debug line
    checkCookieConsent();
});
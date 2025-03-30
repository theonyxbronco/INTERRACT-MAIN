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

// Function to update favicon based on browser color
function updateFavicon() {
    const favicon = document.getElementById('favicon');
    const appleIcon = document.getElementById('apple-touch-icon');
    
    // Get the actual browser background color
    const browserColor = getBrowserColor();
    
    // If we can detect the browser color, use that
    if (browserColor) {
        const isLight = isColorLight(browserColor.r, browserColor.g, browserColor.b);
        
        if (isLight) {
            // Light background detected: use dark favicon
            favicon.href = 'imgs/icons/favicon-dark.svg';
            appleIcon.href = 'imgs/icons/favicon-dark.svg';
            console.log('Light background detected, using dark favicon');
        } else {
            // Dark background detected: use light favicon
            favicon.href = 'imgs/icons/favicon-light.svg';
            appleIcon.href = 'imgs/icons/favicon-light.svg';
            console.log('Dark background detected, using light favicon');
        }
    } else {
        // Fallback to system preference if we can't detect color
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (isDarkMode) {
            favicon.href = 'imgs/icons/favicon-light.svg';
            appleIcon.href = 'imgs/icons/favicon-light.svg';
            console.log('Dark mode preference detected, using light favicon');
        } else {
            favicon.href = 'imgs/icons/favicon-dark.svg';
            appleIcon.href = 'imgs/icons/favicon-dark.svg';
            console.log('Light mode preference detected, using dark favicon');
        }
    }
}

// Run when page loads and DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateFavicon);
} else {
    updateFavicon();
}

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', updateFavicon);

// Check periodically for browser color changes
setInterval(updateFavicon, 1000); // Check every second


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
    document.getElementById("mySidenav").style.opacity = "1";
    document.getElementById("mySidenav").style.visibility = "visible";
    document.getElementById("opener").style.display = "none";
}
  
  function closeNav() {
    document.getElementById("mySidenav").style.opacity = "0";
    document.getElementById("mySidenav").style.visibility = "hidden";
    document.getElementById("opener").style.display = "block";
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




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
/* LOADING SCREEN */
/* ----------------------------------------------------- */
window.addEventListener("load", function() {
    const loader1 = document.querySelector(".loading");
    loader1.className += " hidden"; //class "loader hidden"
  });
  


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
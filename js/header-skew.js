/* ----------------------------------------------------- */
/* HEADER CONTENT MOUSE FOLLOW EFFECT */
/* ----------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function() {
    // Get the header elements
    const headerTextContainer = document.querySelector('.header-title-effects');
    const headerLine = document.querySelector('.header-line');
    const fastContainer = document.querySelector('.fast-container');
    
    // Initial values for transforms
    let moveX = 0;
    let moveY = 0;
    let targetMoveX = 0;
    let targetMoveY = 0;
    
    // Mouse position tracking
    let mouseX = 0;
    let mouseY = 0;
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    
    // Track mouse position
    document.addEventListener('mousemove', throttle(function(e) {
        // Get mouse position relative to the center of the window
        mouseX = (e.clientX - (windowWidth / 2));
        mouseY = (e.clientY - (windowHeight / 2));
        
        // Set target positions with different intensities for each element
        targetMoveX = mouseX;
        targetMoveY = mouseY;
    }, 50));
    
    // Update dimensions on window resize
    window.addEventListener('resize', function() {
        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;
    });
    
    // Animation loop for smooth transitions
    function animateFollow() {
        // Smoothly interpolate current position to target position
        moveX += (targetMoveX - moveX) * 0.05;
        moveY += (targetMoveY - moveY) * 0.05;
        
        // Apply transforms with different intensities for each element
        if (headerTextContainer) {
            // Text container moves slightly opposite to mouse for a subtle effect
            headerTextContainer.style.transform = `translate3d(${-moveX * 0.03}px, ${-moveY * 0.03}px, 0)`;
        }
        
        if (headerLine) {
            // Line moves a bit more than text
            headerLine.style.transform = `translate3d(${-moveX * 0.04}px, ${-moveY * 0.04}px, 0)`;
        }
        
        if (fastContainer) {
            // Fast container moves the most for a layered effect
            fastContainer.style.transform = `translate3d(${-moveX * 0.06}px, ${-moveY * 0.06}px, 0)`;
        }
        
        requestAnimationFrame(animateFollow);
    }
    
    // Start the animation loop
    animateFollow();
});
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
    cursorScaleIntensity: 0.6,    // Reduced base intensity
    cursorMomentum: 0.02, // lower is slowery

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


// Then add your image as an overlay
/*const titleContainer = document.createElement('div');
titleContainer.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    pointer-events: none;
`;

const titleImage = document.createElement('img');
titleImage.src = '../imgs/coming-soon-text.svg';
titleImage.style.cssText = `
    height: 120px;
    width: auto;
`;

titleContainer.appendChild(titleImage);

// Add it to your slider container
document.querySelector('.rgbKineticSlider').appendChild(titleContainer);


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
// Add this OUTSIDE the DOMContentLoaded event
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        location.reload(); // Reload page on resize to reinitialize everything
    }, 250);
});


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

  /* ------------------------------------- */
  /* EVERYTHING ELSE LOL */
  /* ------------------------------------- */



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
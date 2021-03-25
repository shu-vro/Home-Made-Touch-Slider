const slider = document.querySelector(".slider-container");
const slides = document.querySelectorAll(".slide");

let isGrabbed = false,
    startPos = 0,
    animateId = 0,
    currentTranslate = 0,
    currentIndex = 0,
    prevTranslate = 0;

slides.forEach((slide, index) => {
    // For moblie devices
    slide.addEventListener("touchstart", start(index));
    slide.addEventListener("touchend", end);
    slide.addEventListener("touchmove", move);

    // For Computers.
    slide.addEventListener("mousedown", start(index));
    slide.addEventListener("mouseup", end);
    slide.addEventListener("mousleave", end);
    slide.addEventListener("mousemove", move);
});

// Get the current position of user.
function getPositionX(e) {
    return e.type.includes("mouse") ? e.pageX : e.touches[0].pageX; // If event type contains a word like mouse, it gets e.pageX, if it doesn't matches with the word 'mouse', then surely it is a mobile device. So it runs e.touches[0].pageX;
}

// As soon as starts,
function start(index) {
    return (e) => {
        currentIndex = index; // Get the current index number.
        isGrabbed = true;
        startPos = getPositionX(e); // Determine the starting position of the slide.

        slider.classList.add("grabbing"); // Add a class to slider-container.

        animateId = requestAnimationFrame(animate); // Run a function named animate and store it on animateId.
    };
}

function animate() {
    // Here's the animate function and it changes the position of slider.
    setTransform();
    if (isGrabbed) {
        // If grabbed is true, it will be repeated like an animaiton so that we can see the smooth transition.
        requestAnimationFrame(animate);
    }
}

// This sets the slider's style's transform property.
function setTransform() {
    slider.style.transform = `translateX(${currentTranslate}px)`;
}

function move(e) {
    // If user grabs the window, it starts to run the command.
    if (isGrabbed) {
        // The getPositionX function does just what it's said.
        const currentPosition = getPositionX(e);
        currentTranslate = prevTranslate + currentPosition - startPos; // The math behind it is, first it gets the previous translate property, because it adds to the number. Then it adds the current position and substracts the startposition because we have to add the difference between after and before the user grabs the cursor. So, current - start is the difference.
    }
}

function end() {
    isGrabbed = false; // User lefts the window.
    cancelAnimationFrame(animateId); // We cancel the animation of updating the positon of the slider.

    const moveBy = currentTranslate - prevTranslate; // The math behind it, is it catches the current translated pixel - how it was before.

    // If user moves the slider to left, then moveBy is a negative number. But we cannot let user drag the window even if the slider reaches it's max slide. So...
    if (moveBy < -100 && currentIndex < slides.length - 1) {
        currentIndex++;
    } // If user moves the slider to right, then moveBy is a positive number. But we cannot let user drag the window even if the slider reaches it's minimum slide. So...
    if (moveBy > 100 && currentIndex > 0) {
        currentIndex--;
    }

    // Set a new current position.
    setPositionByIndex();
    slider.classList.remove("grabbing");
}

function setPositionByIndex() {
    // The ultimate position
    currentTranslate = currentIndex * -window.innerWidth; // Set a position that will be set after the user releases the window.
    prevTranslate = currentTranslate; // Now set the previous Translate to current translate so that it doesn't moves more.
    setTransform(); // Now update the slider's position.
}

// Stopping context menu to fire. (it fires when user clicks right key)
window.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
});

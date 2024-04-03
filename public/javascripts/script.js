let slideIndex = 0;
let intervalId;

function moveSlider(n) {
    clearInterval(intervalId); // Clear previous interval
    showSlides(slideIndex += n);
    startAutoSlide();
}

function showSlides(n) {
    let slides = document.querySelectorAll('.slider img');
    if (n >= slides.length) {
        slideIndex = 0;
    } else if (n < 0) {
        slideIndex = slides.length - 1;
    }

    for (let i = 0; i < slides.length; i++) {
        slides[i].style.transform = `translateX(-${slideIndex * 100}%)`;
    }
}

function startAutoSlide() {
    intervalId = setInterval(function () {
        moveSlider(1);
    }, 5000); // 5000 milliseconds = 5 seconds
}

// Start auto sliding initially
startAutoSlide();



document.addEventListener("DOMContentLoaded", function () {
    const boxes = document.querySelectorAll("#about-info .why-choose-us>div>div");

    boxes.forEach(box => {
        const header = box.querySelector("#about-info .why-choose-us>div>div>h4");
        const paragraph = box.querySelector("#about-info .why-choose-us>div>div>p");

        header.addEventListener("click", function () {
            boxes.forEach(otherBox => {
                otherBox.querySelector("p").classList.remove("active");
                otherBox.querySelector(".ri-subtract-line").classList.remove("active");
                otherBox.querySelector(".ri-add-circle-line").classList.add("active");
            });

            paragraph.classList.toggle("active");
            header.querySelector(".ri-subtract-line").classList.toggle("active");
            header.querySelector(".ri-add-circle-line").classList.toggle("active");
        });
    });

    // Show first paragraph initially
    boxes[0].querySelector("p").classList.add("active");
    boxes[0].querySelector(".ri-subtract-line").classList.add("active");
});


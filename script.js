"use strict";

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const header = document.querySelector(".header");
const section1 = document.querySelector("#section--1");
const section2 = document.querySelector("#section--2");
const section3 = document.querySelector("#section--3");
const navLink = document.querySelectorAll(".nav__link");
const navLinks = document.querySelector(".nav__links");
const nav = document.querySelector(".nav");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

///////////////////////////////////////
// Scrolling To Button
btnScrollTo.addEventListener("click", function (e) {
  section1.scrollIntoView({ behavior: "smooth" });
});

///////////////////////////////////////
// Page Navigation

// With forEach
// navLink.forEach(function (el) {
//   el.addEventListener("click", function (e) {
//     e.preventDefault();
//     const id = this.getAttribute("href");
//     document.querySelector(id).scrollIntoView({ behavior: "smooth" });
//   });
// });

// With Event Delegation - Matching Strategy
navLinks.addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

///////////////////////////////////////
// Tabbed Components

tabsContainer.addEventListener("click", function (e) {
  const clickedTab = e.target.closest(".operations__tab");

  // Guard clause
  if (!clickedTab) return;

  // Remove the active classes
  tabs.forEach((t) => t.classList.remove("operations__tab--active"));
  tabsContent.forEach((c) => c.classList.remove("operations__content--active"));

  // Add the active classes
  clickedTab.classList.add("operations__tab--active");
  document
    .querySelector(`.operations__content--${clickedTab.dataset.tab}`)
    .classList.add("operations__content--active");
});

///////////////////////////////////////
// Menu Fade Animation

const mouseOverOut = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach((sib) => {
      if (sib !== link) sib.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener("mouseover", mouseOverOut.bind(0.5));

nav.addEventListener("mouseout", mouseOverOut.bind(1));

///////////////////////////////////////
// Sticky Menu with Intersection observer API

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

const navHeight = nav.getBoundingClientRect().height;

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  treshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

///////////////////////////////////////
// Revealing Sections with Intersection observer API

const allSections = document.querySelectorAll(".section");

const revealSec = function (entries, observer) {
  const [entry] = entries;

  if (entry.isIntersecting === false) return;

  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

const sectionsObserver = new IntersectionObserver(revealSec, {
  root: null,
  treshold: 0.2,
});

allSections.forEach(function (section) {
  sectionsObserver.observe(section);
  // section.classList.add("section--hidden");
});

///////////////////////////////////////
// Lazy Load Images with Intersection observer API

const imgTargets = document.querySelectorAll("img[data-src]");

const revealImg = function (entries, observer) {
  const [entry] = entries;

  if (entry.isIntersecting === false) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(revealImg, {
  root: null,
  treshold: 0,
  rootMargin: "200px",
});

imgTargets.forEach(function (img) {
  imgObserver.observe(img);
});

///////////////////////////////////////
// Slider

const slider = function () {
  const slider = document.querySelector(".slider");
  const btnRight = document.querySelector(".slider__btn--right");
  const btnLeft = document.querySelector(".slider__btn--left");

  let currSlide = 0;
  const slides = document.querySelectorAll(".slide");
  const maxSlide = slides.length;
  const dotContainer = document.querySelector(".dots");

  ///// Functions for the slider

  // Creating dots for navigation
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `
    <button class="dots__dot" data-slide="${i}"></button>
    `
      );
    });
  };

  // Active dot
  const activateDot = function (slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  // Active Slide
  const goToSlide = function (slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
  };

  // Next Slide
  const nextSlide = function () {
    if (currSlide === maxSlide - 1) {
      currSlide = 0;
    } else {
      currSlide++;
    }

    goToSlide(currSlide);
    activateDot(currSlide);
  };

  // Prev Slide
  const prevSlide = function () {
    if (currSlide === 0) {
      currSlide = maxSlide - 1;
    } else {
      currSlide--;
    }

    goToSlide(currSlide);
    activateDot(currSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };

  init();

  // Event Listeners to the buttons
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") prevSlide();
    // same function with short circuiting
    e.key === "ArrowRight" && nextSlide();
  });

  // Event Listeners to the buttons
  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const slide = e.target.dataset.slide;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

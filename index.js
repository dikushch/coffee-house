const header = document.querySelector('.header');
const brg = document.querySelector('.header__brg');
const nav = document.querySelector('.header__nav');

const headerHandler = (e) => {
  if (e.target.closest('.header__brg') || e.target.closest('.h-nav__link')) {
    brg.classList.toggle('open');
    nav.classList.toggle('open');
    document.body.classList.toggle('lock');
  }
}

const mediaQuery = window.matchMedia('(max-width: 768px)');

if (mediaQuery.matches) {
  header.addEventListener('click', headerHandler);
}

mediaQuery.addEventListener('change', (e) => {
  if (e.matches) {
    header.addEventListener('click', headerHandler);
  } else {
    header.removeEventListener('click', headerHandler);
    brg.classList.remove('open');
    nav.classList.remove('open');
    document.body.classList.remove('lock');
  }
});

const slider = document.querySelector('.slider');
const sliderItems = document.querySelector('.slider__items');
const sliderBtns = document.querySelector('.slider__btns');
const sliderControls = document.querySelector('.slider__contrrols');

const addActiveInfo = (slide) => {
  sliderItems.children[slide].classList.add('active');
  sliderControls.children[slide].classList.add('active');
}

const removeActiveInfo = (slide) => {
  sliderItems.children[slide].classList.remove('active');
  sliderControls.children[slide].classList.remove('active');
}

const changeSliderPosition = (slideNumber) => {
  sliderItems.style.transform = `translateX(calc(-100% * ${slideNumber})`;
}

const changeListenerTarget = (currentSlide, prevSlide) => {
  currentSlide.addEventListener('animationend', sliderAutoScrollHandler);
  prevSlide.removeEventListener('animationend', sliderAutoScrollHandler);
}

const sliderBtnsHandler = (e) => {
  removeActiveInfo(currentSlide);
  const lastActiveControl = sliderControls.children[currentSlide];

  if (e.target.closest('.s-btns__btn--left')) {
    currentSlide == 0 ? currentSlide = 2 : currentSlide -= 1;
  }

  if (e.target.closest('.s-btns__btn--right')) {
    currentSlide == 2 ? currentSlide = 0 : currentSlide += 1;
  }

  activeSlideControl = sliderControls.children[currentSlide];

  addActiveInfo(currentSlide);
  changeSliderPosition(currentSlide);
  changeListenerTarget(activeSlideControl, lastActiveControl);
}

const sliderAutoScrollHandler = (e) => {
  const lastActiveControl = sliderControls.children[currentSlide];

  removeActiveInfo(currentSlide);

  currentSlide == 2 ? currentSlide = 0 : currentSlide += 1;

  activeSlideControl = sliderControls.children[currentSlide];

  addActiveInfo(currentSlide);
  changeSliderPosition(currentSlide);
  changeListenerTarget(activeSlideControl, lastActiveControl);
}

const touchStartHandler = (e) => {
  startPoint = e.touches[0].clientX;
}

const touchEndHandler = (e) => {
  let swipe = startPoint - e.changedTouches[0].clientX;

  if (Math.abs(swipe) > 50) {
    removeActiveInfo(currentSlide);
    const lastActiveControl = sliderControls.children[currentSlide];

    if (swipe < 0) {
      currentSlide == 0 ? currentSlide = 2 : currentSlide -= 1;
    }

    if (swipe > 0) {
      currentSlide == 2 ? currentSlide = 0 : currentSlide += 1;
    }

    activeSlideControl = sliderControls.children[currentSlide];

    addActiveInfo(currentSlide);
    changeSliderPosition(currentSlide);
    changeListenerTarget(activeSlideControl, lastActiveControl);
  }
}

const poinerOverHandler = (e) => {
  if (e.target.closest('.s-item__wrap')) {
    activeSlideControl.classList.add('paused');
  }
}

const pointerOutHandler = (e) => {
  if (e.target.closest('.s-item__wrap')) {
    activeSlideControl.classList.remove('paused');
  }
}

let currentSlide = 0;
let startPoint;
let activeSlideControl = sliderControls.children[currentSlide];
addActiveInfo(currentSlide);

sliderBtns.addEventListener('click', sliderBtnsHandler);
activeSlideControl.addEventListener('animationend', sliderAutoScrollHandler);
sliderItems.addEventListener('touchstart', (e) => {
  touchStartHandler(e);
  poinerOverHandler(e);
});
sliderItems.addEventListener('touchend', (e) => {
  touchEndHandler(e);
  pointerOutHandler(e);
});
sliderItems.addEventListener('pointerover', poinerOverHandler);
sliderItems.addEventListener('pointerout', pointerOutHandler);
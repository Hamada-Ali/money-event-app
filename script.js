'use strict';
///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelector('.btn--show-modal');
const scrollBtn = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const navLink = document.querySelectorAll('.nav__link');
const navUl = document.querySelector('.nav__links');
const tabContainer = document.querySelector('.operations__tab-container')
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('nav');
const links = document.querySelectorAll('.nav__link')
const sections = document.querySelectorAll('section')
const images = document.querySelectorAll('.lazy-img')

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

  btnsOpenModal.addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


scrollBtn.addEventListener('click', () => {
  section1.scrollIntoView({behavior: 'smooth'});
});

// attach delegation (more effcient than forEach)
navUl.addEventListener('click', e => {
  e.preventDefault();
  if(e.target.classList.contains('nav__link')){
    let target = e.target.getAttribute('href');
    document.querySelector(target).scrollIntoView({behavior: 'smooth'})
  }
});

 tabContainer.addEventListener('click', (e) => {
    let target = e.target.closest('.operations__tab');
    if(!target) return;
      tabs.forEach(tab => { // remove the active class
        tab.classList.remove('operations__tab--active')
      });
    target.classList.add('operations__tab--active')
    let dataId = target.getAttribute('data-tab')
    tabsContent.forEach(content => {
      content.classList.remove('operations__content--active')
      if(content.classList.contains(`operations__content--${dataId}`) === true) {
        content.classList.add('operations__content--active')
      }
    });
  });


  const fadeLinks = (group,action, parent, childs) => {
    group.forEach(link => {
      link.addEventListener(action, e => {
        let parentLinks = parent.querySelectorAll(childs);
        parentLinks.forEach(child => {
          if(child !== e.target && action === 'mouseover') {
            child.style.opacity = 0.5;
            e.target.style.opacity = 1;
            document.querySelector('img').style.opacity = 0.5
          }
          if(child !== e.target && action === 'mouseout') {
            child.style.opacity = 1;
            e.target.style.opacity = 1;
            document.querySelector('img').style.opacity = 1
          }
        });
      });
    });
  }
  fadeLinks(links, 'mouseover', nav, '.nav__link');
  fadeLinks(links, 'mouseout', nav, '.nav__link');

  // intersection observer API
  const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
      if(!entry.isIntersecting) {
        nav.classList.add('sticky');
      } else {
        nav.classList.remove('sticky')
      }
     
    })
  }
  let navHeight = nav.getBoundingClientRect().height;
  let options = {
    root: null, // view port
    threshold: 0,
    rootMargin: `-${navHeight}px`
  };
  const observer = new IntersectionObserver(observerCallback, options);
  let header = document.querySelector('.header')
  observer.observe(header)
// end here

// show sections by toggling hidden--section
const revealCallback = (entries, observer) => {
  const [entry] = entries;
  if(!entry.isIntersecting) return null;
  entry.target.classList.remove('section--hidden')
  revealSection.unobserve(entry.target)
}
let revealOptions = {
  root: null,
  threshold: 0.25
};
const revealSection = new IntersectionObserver(revealCallback, revealOptions);

sections.forEach(section => {
  revealSection.observe(section);
  //section.classList.add('section--hidden');
});

// lazy image loading
const lazyLoad = (imgs, observer) => {
  const [img] = imgs;
  if(!img.isIntersecting) return;
  if(img.target.src !== img.target.dataset.src) img.target.src = img.target.dataset.src;
  img.target.addEventListener('load', () => {
    if (img.target.classList.contains('lazy-img')) img.target.classList.remove('lazy-img');
  });
  lazyImage.unobserve(img.target)
}
const lazyOptions = {
  root: null,
  threshold: 1,
  rootMargin: '200px'
};
const lazyImage = new IntersectionObserver(lazyLoad, lazyOptions)
images.forEach(img => {
  lazyImage.observe(img)
});

//////////////////////////////////////////////////////////////////
/* ---- //////////////// Sliding Section //////////////// ---- */

const slider = () => {
// import elements
const slides = document.querySelectorAll('.slide')
const slideRightBtn = document.querySelector('.slider__btn--right')
const slideLeftBtn = document.querySelector('.slider__btn--left')
const dotsContainer = document.querySelector('.dots')

// starter values
let currentSlide = 0;
const maxSlide = slides.length - 1;

// create dots
const createDots = () => {
  slides.forEach((_, i) => {
    dotsContainer.insertAdjacentHTML('beforeend', 
    `<button class="dots__dot" data-slide="${i}"></button>`)
  })
}

const activeDot = (slideIdx) => {
  const dots = document.querySelectorAll('.dots__dot');
  dots.forEach(dot => {
    dot.classList.remove('dots__dot--active')
  })
  let active = document.querySelector(`.dots__dot[data-slide="${slideIdx}"]`)
  active.classList.add('dots__dot--active')
}

// move slide to the the right 
const calcSlide = (currSlideIdx) => {
  slides.forEach((theSlide, idx) => {
  // idx: the all slides interation, example if we are in slide 2 (1 - 2) === 100 * 1 === 100% (idx === currSideIdx - 1)
    theSlide.style.transform = `translateX(${100 * (idx - currSlideIdx)}%)`
  })
}

// next slide action
const nextSlide = () => {
  currentSlide !== maxSlide ? currentSlide++ : currentSlide = 0;
  calcSlide(currentSlide)
  activeDot(currentSlide)
}
// intialize for opening the page


// preivous slide action 
const previousSlide = () => {
  currentSlide !== 0 ? currentSlide-- : currentSlide = maxSlide;
  calcSlide(currentSlide)
}

slideRightBtn.addEventListener('click', nextSlide)
document.addEventListener('keydown', (e) => {
  const arrowRight = e.key;
  if(arrowRight === 'ArrowRight') nextSlide();
    if(arrowRight === 'ArrowLeft') previousSlide(); 
})

const allocate = (e) => {
   if(e.target.classList.contains('dots__dot')){
    const {slide} = e.target.dataset;
    activeDot(slide)
    calcSlide(slide)
   }
}
// intial function
const init = () => {
  createDots() // you must create first fk 
  nextSlide(0)
  activeDot(0)
}

init()
dotsContainer.addEventListener('click', allocate)
slideLeftBtn.addEventListener('click', previousSlide)
}
slider()

window.addEventListener("beforeunload", function(event) {
  console.log("UNLOAD:1");
  event.preventDefault();
  event.returnValue = 'null'; //"Any text"; //true; //false;
  return 'null'; //"Any text"; //true; //false;
});
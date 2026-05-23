/**
* Template Name: MyResume
* Updated: Nov 17 2023 with Bootstrap v5.3.2
* Template URL: https://bootstrapmade.com/free-html-bootstrap-template-my-resume/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos,
      behavior: 'smooth'
    })
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('body').classList.toggle('mobile-nav-active')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let body = select('body')
      if (body.classList.contains('mobile-nav-active')) {
        body.classList.remove('mobile-nav-active')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Preloader
   */
  let preloader = select('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove()
    });
  }

  /**
   * Hero type effect
   */
  const typed = select('.typed')
  if (typed) {
    let typed_strings = typed.getAttribute('data-typed-items')
    typed_strings = typed_strings.split(',')
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Skills animation
   */
  let skilsContent = select('.skills-content');
  if (skilsContent) {
    new Waypoint({
      element: skilsContent,
      offset: '80%',
      handler: function(direction) {
        let progress = select('.progress .progress-bar', true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute('aria-valuenow') + '%'
        });
      }
    })
  }

  /**
   * Portfolio filter with fade animation (Bootstrap grid)
   */
  const PORTFOLIO_FADE_MS = 450;

  const applyPortfolioFilter = (filterSelector, animate = true) => {
    const filterClass = filterSelector.replace('.', '');
    const items = select('.portfolio-item', true);
    const isMatch = (item) => item.classList.contains(filterClass);

    const showMatchedItems = () => {
      const matched = items.filter(isMatch);

      items.forEach((item) => {
        if (!isMatch(item)) {
          item.classList.add('portfolio-hidden');
          item.classList.remove('portfolio-leaving', 'portfolio-entering', 'portfolio-visible');
        } else {
          item.classList.remove('portfolio-leaving', 'portfolio-hidden');
          if (animate) {
            item.classList.add('portfolio-entering');
          }
        }
      });

      if (animate) {
        matched.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add('portfolio-visible');
          }, index * 70);
        });
        setTimeout(() => {
          items.forEach((item) => {
            item.classList.remove('portfolio-entering', 'portfolio-visible');
          });
        }, PORTFOLIO_FADE_MS + matched.length * 70);
      }

      if (typeof AOS !== 'undefined') {
        AOS.refresh();
      }
    };

    if (!animate) {
      items.forEach((item) => {
        item.classList.toggle('portfolio-hidden', !isMatch(item));
        item.classList.remove('portfolio-leaving', 'portfolio-entering', 'portfolio-visible');
      });
      if (typeof AOS !== 'undefined') {
        AOS.refresh();
      }
      return;
    }

    const leaving = items.filter((item) => !isMatch(item) && !item.classList.contains('portfolio-hidden'));
    if (!leaving.length) {
      showMatchedItems();
      return;
    }

    leaving.forEach((item) => item.classList.add('portfolio-leaving'));
    setTimeout(showMatchedItems, PORTFOLIO_FADE_MS);
  };

  const initPortfolioFilter = () => {
    const portfolioContainer = select('.portfolio-container');
    const portfolioFilters = select('#portfolio-flters li', true);
    if (!portfolioContainer || !portfolioFilters.length) return;

    let currentFilterEl = null;

    const setActiveFilter = (filterEl, animate = true) => {
      if (filterEl === currentFilterEl) return;
      currentFilterEl = filterEl;
      portfolioFilters.forEach((el) => el.classList.remove('filter-active'));
      filterEl.classList.add('filter-active');
      applyPortfolioFilter(filterEl.getAttribute('data-filter'), animate);
      portfolioContainer.classList.add('portfolio-filter-ready');
    };

    const defaultFilterEl = select('#portfolio-flters .filter-active') || portfolioFilters[0];
    setActiveFilter(defaultFilterEl, false);

    on('click', '#portfolio-flters li', function(e) {
      e.preventDefault();
      setActiveFilter(this, true);
    }, true);
  };

  document.addEventListener('DOMContentLoaded', initPortfolioFilter);

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Initiate portfolio details lightbox 
   */
  const portfolioDetailsLightbox = GLightbox({
    selector: '.portfolio-details-lightbox',
    width: '90%',
    height: '90vh'
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Testimonials slider
   */
  new Swiper('.testimonials-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  });

  /**
   * Initiate Pure Counter 
   */
  new PureCounter();

})()
(function ($) {
  'use strict';

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim();
    if (all) {
      return [...document.querySelectorAll(el)];
    } else {
      return document.querySelector(el);
    }
  };

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all);
    if (selectEl) {
      if (all) {
        selectEl.forEach((e) => e.addEventListener(type, listener));
      } else {
        selectEl.addEventListener(type, listener);
      }
    }
  };

  /**
   * Easy on scroll event listener
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener);
  };

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true);
  const navbarlinksActive = () => {
    let position = window.scrollY + 200;
    navbarlinks.forEach((navbarlink) => {
      if (!navbarlink.hash) return;
      let section = select(navbarlink.hash);
      if (!section) return;
      if (
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight
      ) {
        navbarlink.classList.add('menu-active');
      } else {
        navbarlink.classList.remove('menu-active');
      }
    });
  };
  window.addEventListener('load', navbarlinksActive);
  onscroll(document, navbarlinksActive);

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header');
    let offset = header.offsetHeight;

    let elementPos = select(el).offsetTop;
    window.scrollTo({
      top: elementPos + offset,
      behavior: 'smooth'
    });
  };

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on(
    'click',
    '.scrollto',
    function (e) {
      if (select(this.hash)) {
        e.preventDefault();

        let navbar = select('#navbar');
        if (navbar.classList.contains('navbar-mobile')) {
          navbar.classList.remove('navbar-mobile');
          let navbarToggle = select('.mobile-nav-toggle');
          navbarToggle.classList.toggle('bi-list');
          navbarToggle.classList.toggle('bi-x');
        }
        scrollto(this.hash);
      }
    },
    true
  );

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash);
      }
    }
  });

  /**
   * Preloader
   */
  let preloader = select('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  // Porfolio isotope and filter
  $(window).on('load', function () {
    var portfolioIsotope = $('.image-list').isotope({
      itemSelector: '.image-list-item'
    });

    $('#portfolio-flters li').on('click', function () {
      $('#portfolio-flters li').removeClass('filter-active');
      $(this).addClass('filter-active');

      portfolioIsotope.isotope({
        filter: $(this).data('filter')
      });
      aos_init();
    });

    // Initiate venobox (lightbox feature used in portfolio)
    $(document).ready(function () {
      $('.venobox').venobox();
    });
  });

  // Portfolio details carousel
  $('.portfolio-details-carousel').owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    items: 1
  });

  // Init AOS
  function aos_init() {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  $(window).on('load', function () {
    aos_init();
  });

  // Contact Form

  var contactForm = function () {
    if ($('#contactForm').length > 0) {
      $('#contactForm').validate({
        rules: {
          fname: 'required',
          lname: 'required',
          email: {
            required: true,
            email: true
          },
          message: {
            required: true,
            minlength: 5
          }
        },
        messages: {
          fname: 'Please enter your first name',
          lname: 'Please enter your last name',
          email: 'Please enter a valid email address',
          message: 'Please enter a message'
        },
        /* submit via ajax */
        submitHandler: function (form) {
          var $submit = $('.submitting'),
            waitText = 'Submitting...';

          $.ajax({
            type: 'POST',
            url: 'php/send-email.php',
            data: $(form).serialize(),

            beforeSend: function () {
              $submit.css('display', 'block').text(waitText);
            },
            success: function (msg) {
              if (msg == 'OK') {
                $('#form-message-warning').hide();
                setTimeout(function () {
                  $('#contactForm').fadeOut();
                }, 1000);
                setTimeout(function () {
                  $('#form-message-success').fadeIn();
                }, 1400);
              } else {
                $('#form-message-warning').html(msg);
                $('#form-message-warning').fadeIn();
                $submit.css('display', 'none');
              }
            },
            error: function () {
              $('#form-message-warning').html(
                'Something went wrong. Please try again.'
              );
              $('#form-message-warning').fadeIn();
              $submit.css('display', 'none');
            }
          });
        }
      });
    }
  };
  contactForm();
})(jQuery);

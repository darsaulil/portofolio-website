document.addEventListener('DOMContentLoaded', () => {

  /* ==================================================
     1. PORTFOLIO TITLE SCRAMBLE ANIMATION
     ================================================== */
  const portfolioTitle = document.getElementById('portfolioTitle');
  const targetText = 'PORTOFOLIO';
  const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let isScrambling = false;

  function runScramble() {
    if (isScrambling) return;
    isScrambling = true;

    let iteration = 0;
    const totalFrames = 15;

    const interval = setInterval(() => {
      portfolioTitle.innerText = targetText
        .split('')
        .map((char, index) => {
          if (index < (iteration / totalFrames) * targetText.length) {
            return targetText[index];
          }
          return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        })
        .join('');

      iteration++;

      if (iteration > totalFrames) {
        clearInterval(interval);
        portfolioTitle.innerText = targetText;
        isScrambling = false;
      }
    }, 40);
  }

  // Initial page-load scramble
  runScramble();

  // Hover scramble (triggers once per mouse enter)
  portfolioTitle.addEventListener('mouseenter', () => {
    runScramble();
  });

  /* ==================================================
     2. CURSOR PROXIMITY PHOTO HOVER EFFECT
     ================================================== */
  const photoFrames = document.querySelectorAll('.photo-frame, .about-avatar-ring');

  photoFrames.forEach((frame) => {
    frame.addEventListener('pointermove', (event) => {
      const rect = frame.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distanceX = event.clientX - centerX;
      const distanceY = event.clientY - centerY;
      const distance = Math.hypot(distanceX, distanceY);
      const maxDistance = Math.hypot(rect.width / 2, rect.height / 2);
      const proximity = Math.max(0, 1 - distance / (maxDistance * 1.1));

      frame.style.setProperty('--photo-scale', (1 + proximity * 0.12).toFixed(3));
      frame.classList.toggle('is-near', proximity > 0.18);
    });

    frame.addEventListener('pointerleave', () => {
      frame.style.setProperty('--photo-scale', '1');
      frame.classList.remove('is-near');
    });
  });


  /* ==================================================
     3. TYPEWRITER ANIMATION (WEB DEVELOPER & UI/UX CREATOR)
     ================================================== */
  const typewriterElement = document.getElementById('typewriter');
  const phrase = "WEB DEVELOPER & UI/UX CREATOR";
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const pauseEnd = 2000;

  function typeLoop() {
    const currentText = phrase.substring(0, charIndex);
    typewriterElement.innerText = currentText;

    if (!isDeleting && charIndex < phrase.length) {
      charIndex++;
      setTimeout(typeLoop, typingSpeed);
    } else if (!isDeleting && charIndex === phrase.length) {
      setTimeout(() => {
        isDeleting = true;
        typeLoop();
      }, pauseEnd);
    } else if (isDeleting && charIndex > 0) {
      charIndex--;
      setTimeout(typeLoop, deletingSpeed);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      setTimeout(typeLoop, 500);
    }
  }

  typeLoop();


  /* ==================================================
     4. NAVBAR INTERSECTION OBSERVER (ACTIVE LINK UNDERLINE)
     ================================================== */
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${currentId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));


  /* ==================================================
     5. HORIZONTAL PROJECT CAROUSEL
     ================================================== */
  const track = document.getElementById('carouselTrack');
  const cards = Array.from(track.children);
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsNav = document.getElementById('carouselDots');

  let currentIndex = 0;

  function getVisibleCardsCount() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1200) return 2;
    return 3;
  }

  function getMaxIndex() {
    const visibleCards = getVisibleCardsCount();
    return Math.max(0, cards.length - visibleCards);
  }

  function createDots() {
    dotsNav.innerHTML = '';
    const maxIndex = getMaxIndex();
    for (let i = 0; i <= maxIndex; i++) {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => moveToSlide(i));
      dotsNav.appendChild(dot);
    }
  }

  function updateDots() {
    const dots = Array.from(dotsNav.children);
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  function moveToSlide(index) {
    const maxIndex = getMaxIndex();
    currentIndex = Math.min(Math.max(0, index), maxIndex);

    const cardWidth = cards[0].getBoundingClientRect().width;
    const style = window.getComputedStyle(cards[0]);
    const marginRight = parseFloat(style.marginRight) || 0;
    const amountToMove = (cardWidth + marginRight) * currentIndex;

    track.style.transform = `translateX(-${amountToMove}px)`;
    updateDots();
  }

  nextBtn.addEventListener('click', () => {
    if (currentIndex < getMaxIndex()) {
      moveToSlide(currentIndex + 1);
    } else {
      moveToSlide(0); // Loop back to start
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      moveToSlide(currentIndex - 1);
    } else {
      moveToSlide(getMaxIndex()); // Loop to end
    }
  });

  window.addEventListener('resize', () => {
    createDots();
    moveToSlide(currentIndex);
  });

  // Initialize Carousel
  createDots();


  /* ==================================================
     6. SCROLL REVEAL ANIMATION
     ================================================== */
  const revealElements = document.querySelectorAll('.about-container, .skills-wrapper, .carousel-wrapper, .contact-container');

  revealElements.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => revealObserver.observe(el));

  const contactForm = document.getElementById('contactForm');
const formNotification = document.getElementById('formNotification');

contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    submitButton.disabled = true;
    submitButton.textContent = 'MENGIRIM...';

    try {
        const response = await fetch(contactForm.action, {
            method: 'POST',
            body: new FormData(contactForm),
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            contactForm.reset();

            formNotification.classList.add('show');

            setTimeout(() => {
                formNotification.classList.remove('show');
            }, 4000);
        } else {
            alert('Pesan gagal dikirim. Silakan coba lagi.');
        }

    } catch (error) {
        alert('Terjadi kesalahan. Silakan coba lagi.');
    }

    submitButton.disabled = false;
    submitButton.textContent = originalText;
});

});
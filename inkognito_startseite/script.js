const menuToggle = document.querySelector('[data-menu-toggle]');
const siteMenu = document.querySelector('[data-menu]');

if (menuToggle && siteMenu) {
  menuToggle.addEventListener('click', () => {
    const isOpen = siteMenu.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', (event) => {
    const clickedInsideMenu = siteMenu.contains(event.target);
    const clickedToggle = menuToggle.contains(event.target);

    if (!clickedInsideMenu && !clickedToggle) {
      siteMenu.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

const carousel = document.querySelector('[data-carousel]');

if (carousel) {
  const mainImage = carousel.querySelector('[data-carousel-main]');
  const thumbs = Array.from(carousel.querySelectorAll('.thumb'));
  const prevButton = carousel.querySelector('[data-carousel-prev]');
  const nextButton = carousel.querySelector('[data-carousel-next]');
  let currentIndex = thumbs.findIndex((thumb) => thumb.classList.contains('is-active'));

  if (currentIndex < 0) currentIndex = 0;

  const showSlide = (index) => {
    const safeIndex = (index + thumbs.length) % thumbs.length;
    const activeThumb = thumbs[safeIndex];
    const newSrc = activeThumb.dataset.image;
    const newAlt = activeThumb.dataset.alt || '';

    mainImage.src = newSrc;
    mainImage.alt = newAlt;

    thumbs.forEach((thumb, thumbIndex) => {
      thumb.classList.toggle('is-active', thumbIndex === safeIndex);
    });

    currentIndex = safeIndex;
  };

  thumbs.forEach((thumb, index) => {
    thumb.addEventListener('click', () => {
      showSlide(index);
      resetAutoplay();
    });
  });

  prevButton?.addEventListener('click', () => {
    showSlide(currentIndex - 1);
    resetAutoplay();
  });

  nextButton?.addEventListener('click', () => {
    showSlide(currentIndex + 1);
    resetAutoplay();
  });

  let autoplay = setInterval(() => {
    showSlide(currentIndex + 1);
  }, 4000);

  function resetAutoplay() {
    clearInterval(autoplay);
    autoplay = setInterval(() => {
      showSlide(currentIndex + 1);
    }, 4000);
  }
}

const hoverAudio = new Audio();
hoverAudio.volume = 0.45;

const bookHotspots = document.querySelectorAll('.book-hotspot');

bookHotspots.forEach((hotspot) => {
  const playBookSound = () => {
    const soundPath = hotspot.dataset.sound;
    if (!soundPath) return;

    const absolutePath = new URL(soundPath, window.location.href).href;

    if (hoverAudio.src !== absolutePath) {
      hoverAudio.src = soundPath;
      hoverAudio.load();
    }

    hoverAudio.currentTime = 0;
    hoverAudio.play().catch(() => {});
  };

  hotspot.addEventListener('mouseenter', playBookSound);
  hotspot.addEventListener('focus', playBookSound);
});